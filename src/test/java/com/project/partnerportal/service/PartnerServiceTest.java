package com.project.partnerportal.service;

import com.project.partnerportal.dto.PartnerRequest;
import com.project.partnerportal.dto.PartnerResponse;
import com.project.partnerportal.entity.DeliveryPartner;
import com.project.partnerportal.entity.PartnerStatus;
import com.project.partnerportal.entity.VehicleType;
import com.project.partnerportal.exception.DuplicateResourceException;
import com.project.partnerportal.exception.ResourceNotFoundException;
import com.project.partnerportal.repository.AuditLogRepository;
import com.project.partnerportal.repository.DeliveryPartnerRepository;
import com.project.partnerportal.repository.StatusHistoryRepository;
import com.project.partnerportal.service.impl.PartnerServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PartnerServiceTest {

    @Mock
    private DeliveryPartnerRepository partnerRepository;

    @Mock
    private StatusHistoryRepository statusHistoryRepository;

    @Mock
    private AuditLogRepository auditLogRepository;

    @InjectMocks
    private PartnerServiceImpl partnerService;

    private PartnerRequest sampleRequest;
    private DeliveryPartner samplePartner;
    private UUID partnerId;

    @BeforeEach
    void setUp() {
        partnerId = UUID.randomUUID();
        sampleRequest = new PartnerRequest(
                "John Doe",
                "john.doe@example.com",
                "9876543210",
                VehicleType.MOTORCYCLE,
                "MH02AB1234",
                "DL-998877",
                "Mumbai"
        );

        samplePartner = new DeliveryPartner(
                "John Doe",
                "john.doe@example.com",
                "9876543210",
                VehicleType.MOTORCYCLE,
                "MH02AB1234",
                "DL-998877",
                "Mumbai"
        );
        samplePartner.setId(partnerId);
        samplePartner.setCurrentStatus(PartnerStatus.PENDING);
    }

    @Test
    @DisplayName("Should successfully create a new delivery partner in PENDING state")
    void testCreatePartner_Success() {
        when(partnerRepository.existsByEmail(sampleRequest.getEmail())).thenReturn(false);
        when(partnerRepository.existsByPhoneNumber(sampleRequest.getPhoneNumber())).thenReturn(false);
        when(partnerRepository.existsByVehicleRegistrationNumber(sampleRequest.getVehicleRegistrationNumber())).thenReturn(false);
        when(partnerRepository.save(any(DeliveryPartner.class))).thenReturn(samplePartner);

        PartnerResponse response = partnerService.createPartner(sampleRequest, "admin", "127.0.0.1");

        assertNotNull(response);
        assertEquals("John Doe", response.getFullName());
        assertEquals("john.doe@example.com", response.getEmail());
        assertEquals(PartnerStatus.PENDING, response.getCurrentStatus());

        verify(partnerRepository).save(any(DeliveryPartner.class));
        verify(statusHistoryRepository).save(any());
        verify(auditLogRepository).save(any());
    }

    @Test
    @DisplayName("Should throw DuplicateResourceException if email is already registered")
    void testCreatePartner_DuplicateEmail() {
        when(partnerRepository.existsByEmail(sampleRequest.getEmail())).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () ->
                partnerService.createPartner(sampleRequest, "admin", "127.0.0.1")
        );

        verify(partnerRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should retrieve partner details by ID")
    void testGetPartnerById_Success() {
        when(partnerRepository.findById(partnerId)).thenReturn(Optional.of(samplePartner));

        PartnerResponse response = partnerService.getPartnerById(partnerId);

        assertNotNull(response);
        assertEquals(partnerId, response.getId());
        assertEquals("John Doe", response.getFullName());
    }

    @Test
    @DisplayName("Should throw ResourceNotFoundException when partner ID does not exist")
    void testGetPartnerById_NotFound() {
        UUID nonExistentId = UUID.randomUUID();
        when(partnerRepository.findById(nonExistentId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                partnerService.getPartnerById(nonExistentId)
        );
    }

    @Test
    @DisplayName("Should perform multi-criteria partner search with pagination")
    void testSearchPartners_Success() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<DeliveryPartner> partnerPage = new PageImpl<>(List.of(samplePartner), pageable, 1);

        when(partnerRepository.searchPartners("John", null, PartnerStatus.PENDING, null, pageable))
                .thenReturn(partnerPage);

        Page<PartnerResponse> result = partnerService.searchPartners("John", null, PartnerStatus.PENDING, null, pageable);

        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("John Doe", result.getContent().get(0).getFullName());
    }
}
