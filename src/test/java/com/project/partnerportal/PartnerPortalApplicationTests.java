package com.project.partnerportal;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@ActiveProfiles("test")
class PartnerPortalApplicationTests {

    @Test
    @DisplayName("Should successfully load Spring Boot application context")
    void contextLoads() {
        assertTrue(true, "Application context loaded successfully");
    }
}
