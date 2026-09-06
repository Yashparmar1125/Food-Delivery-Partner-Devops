package com.project.partnerportal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.partnerportal.config.SecurityConfig;
import com.project.partnerportal.dto.PartnerRequest;
import com.project.partnerportal.dto.PartnerResponse;
import com.project.partnerportal.entity.PartnerStatus;
import com.project.partnerportal.entity.VehicleType;
import com.project.partnerportal.service.PartnerService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PartnerController.class)
@Import(SecurityConfig.class)
@WithMockUser(authorities = {"ROLE_ADMIN", "ROLE_OPS_MANAGER"})
class PartnerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PartnerService partnerService;

    @Test
    @DisplayName("POST /api/v1/partners should return 201 Created on valid input")
    void testCreatePartner_ValidInput() throws Exception {
        PartnerRequest request = new PartnerRequest(
                "Jane Smith",
                "jane.smith@example.com",
                "9876543210",
                VehicleType.SCOOTER,
                "MH01CD5678",
                "DL-123456",
                "Pune"
        );

        PartnerResponse response = new PartnerResponse();
        response.setId(UUID.randomUUID());
        response.setFullName("Jane Smith");
        response.setEmail("jane.smith@example.com");
        response.setCurrentStatus(PartnerStatus.PENDING);

        when(partnerService.createPartner(any(PartnerRequest.class), anyString(), anyString())).thenReturn(response);

        mockMvc.perform(post("/api/v1/partners")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.fullName").value("Jane Smith"))
                .andExpect(jsonPath("$.data.currentStatus").value("PENDING"));
    }

    @Test
    @DisplayName("POST /api/v1/partners should return 400 Bad Request on invalid email")
    void testCreatePartner_InvalidEmail() throws Exception {
        PartnerRequest request = new PartnerRequest(
                "Jane Smith",
                "not-an-email",
                "9876543210",
                VehicleType.SCOOTER,
                "MH01CD5678",
                "DL-123456",
                "Pune"
        );

        mockMvc.perform(post("/api/v1/partners")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.validationErrors.email").exists());
    }

    @Test
    @DisplayName("GET /api/v1/partners/{id} should return 200 OK with partner data")
    void testGetPartnerById() throws Exception {
        UUID partnerId = UUID.randomUUID();
        PartnerResponse response = new PartnerResponse();
        response.setId(partnerId);
        response.setFullName("Alice Brown");
        response.setEmail("alice@example.com");

        when(partnerService.getPartnerById(eq(partnerId))).thenReturn(response);

        mockMvc.perform(get("/api/v1/partners/" + partnerId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(partnerId.toString()))
                .andExpect(jsonPath("$.data.fullName").value("Alice Brown"));
    }

    @Test
    @DisplayName("GET /api/v1/partners/search should return matching partners")
    void testSearchPartners() throws Exception {
        PartnerResponse response = new PartnerResponse();
        response.setId(UUID.randomUUID());
        response.setFullName("Alice Brown");

        when(partnerService.searchPartners(any(), any(), any(), any(), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(response)));

        mockMvc.perform(get("/api/v1/partners/search")
                        .param("name", "Alice")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].fullName").value("Alice Brown"));
    }
}
