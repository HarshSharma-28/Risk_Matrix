package com.riskmatrix.core.controller;

import com.riskmatrix.core.model.RiskRequest;
import com.riskmatrix.core.model.RiskResult;
import com.riskmatrix.core.service.RiskEngineService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/evaluate")
public class RiskController {

    private final RiskEngineService riskEngineService;

    public RiskController(RiskEngineService riskEngineService) {
        this.riskEngineService = riskEngineService;
    }

    @PostMapping
    public ResponseEntity<RiskResult> evaluateRisk(@Valid @RequestBody RiskRequest request) {
        RiskResult result = riskEngineService.evaluateRisk(request);
        return ResponseEntity.ok(result);
    }
}
