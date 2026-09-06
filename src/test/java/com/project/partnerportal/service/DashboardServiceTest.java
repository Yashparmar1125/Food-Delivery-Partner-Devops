package com.project.partnerportal.service;

import com.project.partnerportal.dto.DashboardSummaryResponse;
import com.project.partnerportal.entity.PartnerStatus;
import com.project.partnerportal.repository.DeliveryPartnerRepository;
import com.project.partnerportal.service.impl.DashboardServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DashboardServiceTest {

    @Mock
    private DeliveryPartnerRepository partnerRepository;

    @InjectMocks
    private DashboardServiceImpl dashboardService;

    @Test
    @DisplayName("Should accurately calculate fleet summary and active percentage")
    void testGetDashboardSummary() {
        when(partnerRepository.count()).thenReturn(100L);
        when(partnerRepository.countByCurrentStatus(PartnerStatus.ACTIVE)).thenReturn(60L);
        when(partnerRepository.countByCurrentStatus(PartnerStatus.PENDING)).thenReturn(15L);
        when(partnerRepository.countByCurrentStatus(PartnerStatus.VERIFICATION)).thenReturn(10L);
        when(partnerRepository.countByCurrentStatus(PartnerStatus.SUSPENDED)).thenReturn(10L);
        when(partnerRepository.countByCurrentStatus(PartnerStatus.REJECTED)).thenReturn(3L);
        when(partnerRepository.countByCurrentStatus(PartnerStatus.DEACTIVATED)).thenReturn(2L);

        DashboardSummaryResponse summary = dashboardService.getDashboardSummary();

        assertNotNull(summary);
        assertEquals(100L, summary.getTotalPartners());
        assertEquals(60L, summary.getActivePartners());
        assertEquals(15L, summary.getPendingPartners());
        assertEquals(10L, summary.getVerificationPartners());
        assertEquals(10L, summary.getSuspendedPartners());
        assertEquals(3L, summary.getRejectedPartners());
        assertEquals(2L, summary.getDeactivatedPartners());
        assertEquals(60.0, summary.getActiveFleetPercentage(), 0.001);
    }
}
