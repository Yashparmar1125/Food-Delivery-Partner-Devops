package com.project.partnerportal;

import com.project.partnerportal.entity.PartnerStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PartnerStatusTest {

    @Test
    @DisplayName("PENDING state should only transition to VERIFICATION or REJECTED")
    void testPendingTransitions() {
        assertTrue(PartnerStatus.PENDING.canTransitionTo(PartnerStatus.VERIFICATION));
        assertTrue(PartnerStatus.PENDING.canTransitionTo(PartnerStatus.REJECTED));
        assertFalse(PartnerStatus.PENDING.canTransitionTo(PartnerStatus.ACTIVE));
        assertFalse(PartnerStatus.PENDING.canTransitionTo(PartnerStatus.SUSPENDED));
        assertFalse(PartnerStatus.PENDING.canTransitionTo(PartnerStatus.DEACTIVATED));
    }

    @Test
    @DisplayName("VERIFICATION state should only transition to ACTIVE or REJECTED")
    void testVerificationTransitions() {
        assertTrue(PartnerStatus.VERIFICATION.canTransitionTo(PartnerStatus.ACTIVE));
        assertTrue(PartnerStatus.VERIFICATION.canTransitionTo(PartnerStatus.REJECTED));
        assertFalse(PartnerStatus.VERIFICATION.canTransitionTo(PartnerStatus.PENDING));
        assertFalse(PartnerStatus.VERIFICATION.canTransitionTo(PartnerStatus.SUSPENDED));
        assertFalse(PartnerStatus.VERIFICATION.canTransitionTo(PartnerStatus.DEACTIVATED));
    }

    @Test
    @DisplayName("ACTIVE state should transition to SUSPENDED or DEACTIVATED")
    void testActiveTransitions() {
        assertTrue(PartnerStatus.ACTIVE.canTransitionTo(PartnerStatus.SUSPENDED));
        assertTrue(PartnerStatus.ACTIVE.canTransitionTo(PartnerStatus.DEACTIVATED));
        assertFalse(PartnerStatus.ACTIVE.canTransitionTo(PartnerStatus.PENDING));
        assertFalse(PartnerStatus.ACTIVE.canTransitionTo(PartnerStatus.VERIFICATION));
    }

    @Test
    @DisplayName("SUSPENDED state should transition to ACTIVE or DEACTIVATED")
    void testSuspendedTransitions() {
        assertTrue(PartnerStatus.SUSPENDED.canTransitionTo(PartnerStatus.ACTIVE));
        assertTrue(PartnerStatus.SUSPENDED.canTransitionTo(PartnerStatus.DEACTIVATED));
        assertFalse(PartnerStatus.SUSPENDED.canTransitionTo(PartnerStatus.PENDING));
        assertFalse(PartnerStatus.SUSPENDED.canTransitionTo(PartnerStatus.REJECTED));
    }

    @Test
    @DisplayName("Terminal states (REJECTED, DEACTIVATED) should not allow any transitions")
    void testTerminalStateTransitions() {
        for (PartnerStatus status : PartnerStatus.values()) {
            assertFalse(PartnerStatus.REJECTED.canTransitionTo(status));
            assertFalse(PartnerStatus.DEACTIVATED.canTransitionTo(status));
        }
    }
}
