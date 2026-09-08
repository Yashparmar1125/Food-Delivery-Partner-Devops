package com.project.partnerportal.controller;

import com.project.partnerportal.dto.ApiResponse;
import com.project.partnerportal.dto.DeliveryOrderDto;
import com.project.partnerportal.dto.PartnerMeResponse;
import com.project.partnerportal.dto.PartnerRegistrationDto;
import com.project.partnerportal.service.PartnerPortalService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/partner")
@Tag(name = "Partner Self-Service Portal", description = "Endpoints for rider profile, duty status toggle, and delivery dispatching")
@PreAuthorize("hasAuthority('ROLE_PARTNER')")
public class PartnerPortalController {

    private final PartnerPortalService partnerPortalService;

    public PartnerPortalController(PartnerPortalService partnerPortalService) {
        this.partnerPortalService = partnerPortalService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get Partner Self Profile", description = "Retrieves authenticated delivery partner's profile and KYC status")
    public ResponseEntity<ApiResponse<PartnerMeResponse>> getMyProfile(Principal principal) {
        String username = principal.getName();
        PartnerMeResponse response = partnerPortalService.getMyProfile(username);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/me/duty")
    @Operation(summary = "Update Duty Status", description = "Toggles rider online/offline state")
    public ResponseEntity<ApiResponse<PartnerMeResponse>> updateDuty(
            @RequestBody Map<String, Boolean> payload,
            Principal principal) {
        String username = principal.getName();
        boolean online = payload.getOrDefault("online", false);
        PartnerMeResponse response = partnerPortalService.updateDutyStatus(username, online);
        return ResponseEntity.ok(ApiResponse.success("Duty status updated to " + (online ? "ONLINE" : "OFFLINE"), response));
    }

    @PutMapping("/me/reapply")
    @Operation(summary = "Re-submit KYC Application", description = "Re-applies after a rejection by updating personal and vehicle documents")
    public ResponseEntity<ApiResponse<PartnerMeResponse>> reapplyKyc(
            @Valid @RequestBody PartnerRegistrationDto dto,
            Principal principal) {
        String username = principal.getName();
        PartnerMeResponse response = partnerPortalService.reapplyKyc(username, dto);
        return ResponseEntity.ok(ApiResponse.success("KYC re-submitted successfully. Status is now PENDING.", response));
    }

    @GetMapping("/orders/available")
    @Operation(summary = "Get Available Deliveries", description = "Retrieves real-time dispatch orders available for pickup")
    public ResponseEntity<ApiResponse<List<DeliveryOrderDto>>> getAvailableOrders(Principal principal) {
        String username = principal.getName();
        List<DeliveryOrderDto> orders = partnerPortalService.getAvailableOrders(username);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PostMapping("/orders/{orderId}/complete")
    @Operation(summary = "Complete Delivery Order", description = "Marks a delivery order completed and credits rider earnings")
    public ResponseEntity<ApiResponse<PartnerMeResponse>> completeOrder(
            @PathVariable String orderId,
            @RequestParam(required = false, defaultValue = "75.0") Double payout,
            Principal principal) {
        String username = principal.getName();
        PartnerMeResponse updatedProfile = partnerPortalService.completeOrder(username, orderId, payout);
        return ResponseEntity.ok(ApiResponse.success("Order " + orderId + " completed! Earned ₹" + payout, updatedProfile));
    }
}
