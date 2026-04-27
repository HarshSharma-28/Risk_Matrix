package com.riskmatrix.core.model;

import java.math.BigDecimal;

public class RiskResult {
    private BigDecimal calculatedScore;
    private String decision; // Defined Enums: "APPROVE", "REVIEW", "REJECT"
    private String explanation;

    public BigDecimal getCalculatedScore() { return calculatedScore; }
    public void setCalculatedScore(BigDecimal calculatedScore) { this.calculatedScore = calculatedScore; }

    public String getDecision() { return decision; }
    public void setDecision(String decision) { this.decision = decision; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
}
