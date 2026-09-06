package com.project.partnerportal;

import com.project.partnerportal.dto.PartnerRequest;
import com.project.partnerportal.dto.PartnerResponse;
import com.project.partnerportal.dto.StatusHistoryResponse;
import com.project.partnerportal.dto.StatusUpdateRequest;
import com.project.partnerportal.entity.PartnerStatus;
import com.project.partnerportal.entity.VehicleType;
import com.project.partnerportal.exception.DuplicateResourceException;
import com.project.partnerportal.exception.InvalidStatusTransitionException;
import com.project.partnerportal.service.PartnerService;
import com.project.partnerportal.service.PartnerStatusService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class RegressionSuiteTest {

    @Autowired
    private PartnerService partnerService;

    @Autowired
    private PartnerStatusService partnerStatusService;

    @Test
    @DisplayName("Regression: End-to-end Partner lifecycle transition chain with audit verification")
    void testCompletePartnerLifecycleTransitions() {
        // 1. Onboard partner
        PartnerRequest createReq = new PartnerRequest(
                "Regression Driver",
                "regression.driver@example.com",
                "9811223344",
                VehicleType.MOTORCYCLE,
                "MH04AA1122",
                "LIC-998811",
                "Thane"
        );

        PartnerResponse partner = partnerService.createPartner(createReq, "admin_user", "192.168.1.10");
        assertNotNull(partner.getId());
        assertEquals(PartnerStatus.PENDING, partner.getCurrentStatus());
        assertTrue(partner.isActive());

        UUID partnerId = partner.getId();

        // 2. Transition: PENDING -> VERIFICATION
        PartnerResponse v1 = partnerStatusService.updatePartnerStatus(
                partnerId,
                new StatusUpdateRequest(PartnerStatus.VERIFICATION, "KYC documents submitted", "ops_user"),
                "ops_user",
                "192.168.1.11"
        );
        assertEquals(PartnerStatus.VERIFICATION, v1.getCurrentStatus());

        // 3. Transition: VERIFICATION -> ACTIVE
        PartnerResponse v2 = partnerStatusService.updatePartnerStatus(
                partnerId,
                new StatusUpdateRequest(PartnerStatus.ACTIVE, "Police verification cleared", "ops_user"),
                "ops_user",
                "192.168.1.11"
        );
        assertEquals(PartnerStatus.ACTIVE, v2.getCurrentStatus());
        assertTrue(v2.isActive());

        // 4. Transition: ACTIVE -> SUSPENDED
        PartnerResponse v3 = partnerStatusService.updatePartnerStatus(
                partnerId,
                new StatusUpdateRequest(PartnerStatus.SUSPENDED, "Customer complaint pending inquiry", "ops_user"),
                "ops_user",
                "192.168.1.11"
        );
        assertEquals(PartnerStatus.SUSPENDED, v3.getCurrentStatus());

        // 5. Transition: SUSPENDED -> ACTIVE
        PartnerResponse v4 = partnerStatusService.updatePartnerStatus(
                partnerId,
                new StatusUpdateRequest(PartnerStatus.ACTIVE, "Inquiry resolved - exonerated", "admin_user"),
                "admin_user",
                "192.168.1.10"
        );
        assertEquals(PartnerStatus.ACTIVE, v4.getCurrentStatus());

        // 6. Transition: ACTIVE -> DEACTIVATED
        PartnerResponse v5 = partnerStatusService.updatePartnerStatus(
                partnerId,
                new StatusUpdateRequest(PartnerStatus.DEACTIVATED, "Partner voluntary resignation", "admin_user"),
                "admin_user",
                "192.168.1.10"
        );
        assertEquals(PartnerStatus.DEACTIVATED, v5.getCurrentStatus());
        assertFalse(v5.isActive());

        // 7. Verify audit history contains all chronological transitions
        List<StatusHistoryResponse> history = partnerStatusService.getPartnerStatusHistory(partnerId);
        assertNotNull(history);
        assertTrue(history.size() >= 6, "Expected at least 6 historical records including initial creation");
        assertEquals(PartnerStatus.DEACTIVATED, history.get(0).getNewStatus());
    }

    @Test
    @DisplayName("Regression: Reject illegal jumps across state boundaries")
    void testIllegalStateTransitions() {
        PartnerRequest createReq = new PartnerRequest(
                "Boundary Driver",
                "boundary.driver@example.com",
                "9811223399",
                VehicleType.CAR,
                "MH04AA9988",
                "LIC-998899",
                "Navi Mumbai"
        );

        PartnerResponse partner = partnerService.createPartner(createReq, "admin_user", "127.0.0.1");

        // Attempt PENDING -> DEACTIVATED (forbidden)
        assertThrows(InvalidStatusTransitionException.class, () ->
                partnerStatusService.updatePartnerStatus(
                        partner.getId(),
                        new StatusUpdateRequest(PartnerStatus.DEACTIVATED, "Premature deactivation", "ops_user"),
                        "ops_user",
                        "127.0.0.1"
                )
        );

        // Attempt PENDING -> ACTIVE (forbidden without verification)
        assertThrows(InvalidStatusTransitionException.class, () ->
                partnerStatusService.updatePartnerStatus(
                        partner.getId(),
                        new StatusUpdateRequest(PartnerStatus.ACTIVE, "Direct activation bypass", "ops_user"),
                        "ops_user",
                        "127.0.0.1"
                )
        );
    }

    @Test
    @DisplayName("Regression: Duplicate vehicle registration enforcement across distinct partner records")
    void testDuplicateVehicleRegistration() {
        PartnerRequest req1 = new PartnerRequest(
                "First Driver",
                "driver1@example.com",
                "9800000001",
                VehicleType.SCOOTER,
                "MH01REG100",
                "LIC-100",
                "Mumbai"
        );
        partnerService.createPartner(req1, "admin", "127.0.0.1");

        PartnerRequest req2 = new PartnerRequest(
                "Second Driver",
                "driver2@example.com",
                "9800000002",
                VehicleType.SCOOTER,
                "MH01REG100", // Duplicate registration
                "LIC-200",
                "Mumbai"
        );

        assertThrows(DuplicateResourceException.class, () ->
                partnerService.createPartner(req2, "admin", "127.0.0.1")
        );
    }

    @Test
    @DisplayName("Regression: Multi-criteria search query combination")
    void testSearchQueryFiltering() {
        PartnerRequest req = new PartnerRequest(
                "Search Target Driver",
                "search.target@example.com",
                "9877777777",
                VehicleType.VAN,
                "MH03VAN777",
                "LIC-777",
                "Nagpur"
        );
        partnerService.createPartner(req, "admin", "127.0.0.1");

        Page<PartnerResponse> results = partnerService.searchPartners("Target", "98777", PartnerStatus.PENDING, VehicleType.VAN, PageRequest.of(0, 10));
        assertNotNull(results);
        assertTrue(results.getTotalElements() >= 1);
        assertEquals("Search Target Driver", results.getContent().get(0).getFullName());
    }
}
