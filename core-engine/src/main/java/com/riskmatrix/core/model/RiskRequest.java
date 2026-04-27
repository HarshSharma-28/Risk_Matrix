package com.riskmatrix.core.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class RiskRequest {
    @NotNull(message = "Income is required")
    @Min(value = 0, message = "Income cannot be negative")
    private BigDecimal income;

    @NotNull(message = "Debt amount is required")
    @Min(value = 0, message = "Debt cannot be negative")
    private BigDecimal debtAmount;

    @NotNull(message = "Credit score is required")
    @Min(value = 300, message = "Credit score must be at least 300")
    @Max(value = 900, message = "Credit score cannot exceed 900")
    private Integer creditScore;
    
    // Default fallback to "WEIGHTED_AVG" if undefined 
    private String strategyType = "WEIGHTED_AVG"; 

    @NotNull(message = "User ID is required")
    private String userId;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public BigDecimal getIncome() { return income; }
    public void setIncome(BigDecimal income) { this.income = income; }
    
    public BigDecimal getDebtAmount() { return debtAmount; }
    public void setDebtAmount(BigDecimal debtAmount) { this.debtAmount = debtAmount; }
    
    public Integer getCreditScore() { return creditScore; }
    public void setCreditScore(Integer creditScore) { this.creditScore = creditScore; }
    
    public String getStrategyType() { return strategyType; }
    public void setStrategyType(String strategyType) { this.strategyType = strategyType; }
}
