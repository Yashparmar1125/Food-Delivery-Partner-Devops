package com.project.partnerportal.controller;

import com.project.partnerportal.config.SecurityConfig;
import com.project.partnerportal.dto.DashboardSummaryResponse;
import com.project.partnerportal.service.DashboardService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DashboardController.class)
@Import(SecurityConfig.class)
@WithMockUser(authorities = {"ROLE_ADMIN", "ROLE_OPS_MANAGER"})
class DashboardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DashboardService dashboardService;

    @Test
    @DisplayName("GET /api/v1/dashboard/summary should return dashboard metrics")
    void testGetSummary() throws Exception {
        DashboardSummaryResponse response = new DashboardSummaryResponse(10, 5, 2, 1, 1, 1, 0);
        when(dashboardService.getDashboardSummary()).thenReturn(response);

        mockMvc.perform(get("/api/v1/dashboard/summary")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalPartners").value(10))
                .andExpect(jsonPath("$.data.activePartners").value(5))
                .andExpect(jsonPath("$.data.activeFleetPercentage").value(50.0));
    }
}
