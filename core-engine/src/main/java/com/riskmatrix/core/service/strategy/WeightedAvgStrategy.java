package com.riskmatrix.core.service.strategy;

import com.riskmatrix.core.model.RiskRequest;
import com.riskmatrix.core.model.RiskResult;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component
public class WeightedAvgStrategy implements RiskStrategy {

    @Override
    public String getStrategyName() {
        return "WEIGHTED_AVG";
    }

    @Override
    public RiskResult calculateRisk(RiskRequest request) {
        // High level logic logic for risk score mathematically (0 = bad, 100 = good)
        // Debt-to-income (DTI) ratio
        BigDecimal income = request.getIncome().max(BigDecimal.ONE); // Prevent div/0
        BigDecimal dti = request.getDebtAmount().divide(income, 4, RoundingMode.HALF_UP);
        
        // Normalize credit score (300 to 900) to 0-100 scale
        double csNormalized = ((request.getCreditScore() - 300.0) / 600.0) * 100.0;
        
        // Penalize heavily for high DTI
        double dtiPenalty = 0;
        if (dti.doubleValue() > 0.40) {
            dtiPenalty = (dti.doubleValue() - 0.40) * 100; // Drop score drastically over 40% DTI
        }
        
        double finalScoreRaw = csNormalized - dtiPenalty;
        // Clamp between 0 and 100
        finalScoreRaw = Math.max(0, Math.min(100, finalScoreRaw));
        BigDecimal finalScore = BigDecimal.valueOf(finalScoreRaw).setScale(2, RoundingMode.HALF_UP);
        
        String decision;
        String explanation;
        
        if (finalScoreRaw >= 70) {
            decision = "APPROVE";
            explanation = "Risk score is optimal. DTI is under control and credit history is strong.";
        } else if (finalScoreRaw >= 45) {
            decision = "REVIEW";
            explanation = "Risk score is borderline. Manual employee review is required to assess true ability to repay.";
        } else {
            decision = "REJECT";
            explanation = "High risk flagged. Credit score is too low or Debt-to-Income ratio severely exceeds safety thresholds.";
        }
        
        RiskResult result = new RiskResult();
        result.setCalculatedScore(finalScore);
        result.setDecision(decision);
        result.setExplanation(explanation);
        
        return result;
    }
}
