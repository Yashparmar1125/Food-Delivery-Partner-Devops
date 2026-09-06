package com.project.partnerportal.controller;

import com.project.partnerportal.dto.ApiResponse;
import com.project.partnerportal.dto.PartnerRequest;
import com.project.partnerportal.dto.PartnerResponse;
import com.project.partnerportal.entity.PartnerStatus;
import com.project.partnerportal.entity.VehicleType;
import com.project.partnerportal.service.PartnerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/partners")
@Tag(name = "Partner Management", description = "Endpoints for managing food delivery partner profiles, onboarding, search and lifecycle")
public class PartnerController {

    private final PartnerService partnerService;

    public PartnerController(PartnerService partnerService) {
        this.partnerService = partnerService;
    }

    @PostMapping
    @Operation(summary = "Create Delivery Partner", description = "Onboards a new delivery partner in PENDING state")
    public ResponseEntity<ApiResponse<PartnerResponse>> createPartner(
            @Valid @RequestBody PartnerRequest request,
            HttpServletRequest servletRequest,
            Principal principal) {
        String actor = principal != null ? principal.getName() : "ANONYMOUS";
        String clientIp = servletRequest.getRemoteAddr();
        PartnerResponse created = partnerService.createPartner(request, actor, clientIp);
        return new ResponseEntity<>(ApiResponse.success("Partner onboarded successfully", created), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Partner Details", description = "Retrieves delivery partner profile by UUID")
    public ResponseEntity<ApiResponse<PartnerResponse>> getPartnerById(@PathVariable UUID id) {
        PartnerResponse response = partnerService.getPartnerById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping
    @Operation(summary = "List Partners", description = "Retrieves a paginated list of all delivery partners")
    public ResponseEntity<ApiResponse<Page<PartnerResponse>>> getAllPartners(
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<PartnerResponse> partners = partnerService.getAllPartners(pageable);
        return ResponseEntity.ok(ApiResponse.success(partners));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update Partner Profile", description = "Updates personal, vehicle, and contact information for an existing partner")
    public ResponseEntity<ApiResponse<PartnerResponse>> updatePartner(
            @PathVariable UUID id,
            @Valid @RequestBody PartnerRequest request,
            HttpServletRequest servletRequest,
            Principal principal) {
        String actor = principal != null ? principal.getName() : "ANONYMOUS";
        String clientIp = servletRequest.getRemoteAddr();
        PartnerResponse updated = partnerService.updatePartner(id, request, actor, clientIp);
        return ResponseEntity.ok(ApiResponse.success("Partner details updated successfully", updated));
    }

    @GetMapping("/search")
    @Operation(summary = "Search Partners", description = "Multi-attribute paginated search by name, phone, status, and vehicle type")
    public ResponseEntity<ApiResponse<Page<PartnerResponse>>> searchPartners(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) PartnerStatus status,
            @RequestParam(required = false) VehicleType vehicleType,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<PartnerResponse> searchResults = partnerService.searchPartners(name, phone, status, vehicleType, pageable);
        return ResponseEntity.ok(ApiResponse.success(searchResults));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate Partner", description = "Soft-deletes / deactivates a delivery partner profile")
    public ResponseEntity<ApiResponse<Void>> deletePartner(
            @PathVariable UUID id,
            HttpServletRequest servletRequest,
            Principal principal) {
        String actor = principal != null ? principal.getName() : "ANONYMOUS";
        String clientIp = servletRequest.getRemoteAddr();
        partnerService.deletePartner(id, actor, clientIp);
        return ResponseEntity.ok(ApiResponse.success("Partner successfully deactivated", null));
    }
}
