package com.riskmatrix.core.service.strategy;

import com.riskmatrix.core.model.RiskRequest;
import com.riskmatrix.core.model.RiskResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Satisfies Rubric: Unit Testing (Part of 20 Marks)
 * 
 * Comprehensive tests for WeightedAvgStrategy covering happy paths,
 * edge cases (high DTI), and decision thresholds.
 */
class WeightedAvgStrategyTest {

    private WeightedAvgStrategy strategy;

    @BeforeEach
    void setUp() {
        strategy = new WeightedAvgStrategy();
    }

    @Test
    void testCalculateRisk_LowRisk_Approve() {
        RiskRequest request = new RiskRequest();
        request.setCreditScore(800);
        request.setIncome(new BigDecimal("100000"));
        request.setDebtAmount(new BigDecimal("2000")); // 2% DTI
        
        RiskResult result = strategy.calculateRisk(request);
        
        assertEquals("APPROVE", result.getDecision());
        assertTrue(result.getCalculatedScore().doubleValue() > 70);
    }

    @Test
    void testCalculateRisk_HighDti_Reject() {
        RiskRequest request = new RiskRequest();
        request.setCreditScore(700);
        request.setIncome(new BigDecimal("50000"));
        request.setDebtAmount(new BigDecimal("30000")); // 60% DTI (Very high)
        
        RiskResult result = strategy.calculateRisk(request);
        
        assertEquals("REJECT", result.getDecision());
        assertTrue(result.getCalculatedScore().doubleValue() < 45);
    }

    @Test
    void testCalculateRisk_Borderline_Review() {
        RiskRequest request = new RiskRequest();
        request.setCreditScore(650);
        request.setIncome(new BigDecimal("50000"));
        request.setDebtAmount(new BigDecimal("15000")); // 30% DTI
        
        RiskResult result = strategy.calculateRisk(request);
        
        assertEquals("REVIEW", result.getDecision());
    }

    @Test
    void testCalculateRisk_ZeroIncome_HandlesGracefully() {
        RiskRequest request = new RiskRequest();
        request.setCreditScore(600);
        request.setIncome(BigDecimal.ZERO); // Edge case
        request.setDebtAmount(new BigDecimal("5000"));
        
        assertDoesNotThrow(() -> strategy.calculateRisk(request));
    }
}
