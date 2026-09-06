package com.project.partnerportal.controller;

import com.project.partnerportal.dto.ApiResponse;
import com.project.partnerportal.dto.PartnerResponse;
import com.project.partnerportal.dto.StatusHistoryResponse;
import com.project.partnerportal.dto.StatusUpdateRequest;
import com.project.partnerportal.service.PartnerStatusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/partners")
@Tag(name = "Partner Status Workflow", description = "Endpoints for transitioning delivery partner statuses and auditing history")
public class StatusHistoryController {

    private final PartnerStatusService partnerStatusService;

    public StatusHistoryController(PartnerStatusService partnerStatusService) {
        this.partnerStatusService = partnerStatusService;
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update Partner Status", description = "Executes state-machine validated transition (e.g. PENDING -> VERIFICATION -> ACTIVE)")
    public ResponseEntity<ApiResponse<PartnerResponse>> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody StatusUpdateRequest request,
            HttpServletRequest servletRequest,
            Principal principal) {
        String actor = principal != null ? principal.getName() : "ANONYMOUS";
        String clientIp = servletRequest.getRemoteAddr();
        PartnerResponse response = partnerStatusService.updatePartnerStatus(id, request, actor, clientIp);
        return ResponseEntity.ok(ApiResponse.success("Partner status transitioned successfully", response));
    }

    @GetMapping("/{id}/history")
    @Operation(summary = "Get Status History", description = "Retrieves chronological audit log of all status transitions for a partner")
    public ResponseEntity<ApiResponse<List<StatusHistoryResponse>>> getStatusHistory(@PathVariable UUID id) {
        List<StatusHistoryResponse> history = partnerStatusService.getPartnerStatusHistory(id);
        return ResponseEntity.ok(ApiResponse.success(history));
    }
}
