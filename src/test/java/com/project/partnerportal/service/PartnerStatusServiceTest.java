package com.project.partnerportal.service;

import com.project.partnerportal.dto.PartnerResponse;
import com.project.partnerportal.dto.StatusUpdateRequest;
import com.project.partnerportal.entity.DeliveryPartner;
import com.project.partnerportal.entity.PartnerStatus;
import com.project.partnerportal.entity.VehicleType;
import com.project.partnerportal.exception.InvalidStatusTransitionException;
import com.project.partnerportal.repository.AuditLogRepository;
import com.project.partnerportal.repository.DeliveryPartnerRepository;
import com.project.partnerportal.repository.StatusHistoryRepository;
import com.project.partnerportal.service.impl.PartnerStatusServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PartnerStatusServiceTest {

    @Mock
    private DeliveryPartnerRepository partnerRepository;

    @Mock
    private StatusHistoryRepository statusHistoryRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private PartnerStatusServiceImpl partnerStatusService;

    private UUID partnerId;
    private DeliveryPartner partner;

    @BeforeEach
    void setUp() {
        partnerId = UUID.randomUUID();
        partner = new DeliveryPartner(
                "Driver Test",
                "driver@test.com",
                "9876500000",
                VehicleType.MOTORCYCLE,
                "MH01ZZ9999",
                "DL-001122",
                "Mumbai"
        );
        partner.setId(partnerId);
        partner.setCurrentStatus(PartnerStatus.PENDING);
    }

    @Test
    @DisplayName("Should successfully transition partner from PENDING to VERIFICATION")
    void testUpdateStatus_ValidTransition() {
        StatusUpdateRequest request = new StatusUpdateRequest(PartnerStatus.VERIFICATION, "Documents submitted", "ops_manager");
        when(partnerRepository.findById(partnerId)).thenReturn(Optional.of(partner));
        when(partnerRepository.save(any(DeliveryPartner.class))).thenReturn(partner);

        PartnerResponse response = partnerStatusService.updatePartnerStatus(partnerId, request, "ops_manager", "127.0.0.1");

        assertNotNull(response);
        assertEquals(PartnerStatus.VERIFICATION, response.getCurrentStatus());
        verify(partnerRepository).save(partner);
        verify(statusHistoryRepository).save(any());
        verify(auditLogRepository).save(any());
    }

    @Test
    @DisplayName("Should reject illegal transition from PENDING directly to ACTIVE")
    void testUpdateStatus_InvalidTransition_PendingToActive() {
        StatusUpdateRequest request = new StatusUpdateRequest(PartnerStatus.ACTIVE, "Direct activation", "ops_manager");
        when(partnerRepository.findById(partnerId)).thenReturn(Optional.of(partner));

        InvalidStatusTransitionException ex = assertThrows(InvalidStatusTransitionException.class, () ->
                partnerStatusService.updatePartnerStatus(partnerId, request, "ops_manager", "127.0.0.1")
        );

        assertTrue(ex.getMessage().contains("Illegal state transition from PENDING to ACTIVE"));
        verify(partnerRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should reject illegal transition from PENDING directly to DEACTIVATED")
    void testUpdateStatus_InvalidTransition_PendingToDeactivated() {
        StatusUpdateRequest request = new StatusUpdateRequest(PartnerStatus.DEACTIVATED, "Direct deactivation", "ops_manager");
        when(partnerRepository.findById(partnerId)).thenReturn(Optional.of(partner));

        assertThrows(InvalidStatusTransitionException.class, () ->
                partnerStatusService.updatePartnerStatus(partnerId, request, "ops_manager", "127.0.0.1")
        );
    }
}
