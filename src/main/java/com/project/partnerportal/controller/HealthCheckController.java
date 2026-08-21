package com.project.partnerportal.controller;

import com.project.partnerportal.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
@Tag(name = "Health & Liveness Probes", description = "Endpoints for checking system status, version and liveness")
public class HealthCheckController {

    @GetMapping
    @Operation(summary = "Application Health Status", description = "Returns the operational health and environment metadata")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealthStatus() {
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("application", "Jenkins-Based Food Delivery Partner Portal");
        healthInfo.put("version", "1.0.0-SNAPSHOT");
        healthInfo.put("timestamp", LocalDateTime.now());
        healthInfo.put("phase", "Weeks 1-4 Foundation");

        return ResponseEntity.ok(ApiResponse.success("Application is running normally", healthInfo));
    }
}
