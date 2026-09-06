package com.project.partnerportal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.partnerportal.config.SecurityConfig;
import com.project.partnerportal.dto.PartnerResponse;
import com.project.partnerportal.dto.StatusHistoryResponse;
import com.project.partnerportal.dto.StatusUpdateRequest;
import com.project.partnerportal.entity.PartnerStatus;
import com.project.partnerportal.service.PartnerStatusService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(StatusHistoryController.class)
@Import(SecurityConfig.class)
@WithMockUser(authorities = {"ROLE_ADMIN", "ROLE_OPS_MANAGER"})
class StatusHistoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PartnerStatusService partnerStatusService;

    @Test
    @DisplayName("PATCH /api/v1/partners/{id}/status should transition status and return 200 OK")
    void testUpdateStatus_Success() throws Exception {
        UUID partnerId = UUID.randomUUID();
        StatusUpdateRequest request = new StatusUpdateRequest(PartnerStatus.VERIFICATION, "Verified documents", "admin");

        PartnerResponse response = new PartnerResponse();
        response.setId(partnerId);
        response.setCurrentStatus(PartnerStatus.VERIFICATION);

        when(partnerStatusService.updatePartnerStatus(eq(partnerId), any(StatusUpdateRequest.class), any(), any()))
                .thenReturn(response);

        mockMvc.perform(patch("/api/v1/partners/" + partnerId + "/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.currentStatus").value("VERIFICATION"));
    }

    @Test
    @DisplayName("GET /api/v1/partners/{id}/history should return status history list")
    void testGetStatusHistory_Success() throws Exception {
        UUID partnerId = UUID.randomUUID();
        StatusHistoryResponse history = new StatusHistoryResponse();
        history.setId(UUID.randomUUID());
        history.setPartnerId(partnerId);
        history.setPreviousStatus(PartnerStatus.PENDING);
        history.setNewStatus(PartnerStatus.VERIFICATION);
        history.setReason("Documents validated");
        history.setCreatedAt(LocalDateTime.now());

        when(partnerStatusService.getPartnerStatusHistory(partnerId)).thenReturn(List.of(history));

        mockMvc.perform(get("/api/v1/partners/" + partnerId + "/history")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].newStatus").value("VERIFICATION"));
    }
}
