package com.riskmatrix.core.service.strategy;

import com.riskmatrix.core.model.RiskRequest;
import com.riskmatrix.core.model.RiskResult;

public interface RiskStrategy {
    RiskResult calculateRisk(RiskRequest request);
    String getStrategyName();
}
