package com.project.partnerportal.entity;

public enum PartnerStatus {
    PENDING,
    VERIFICATION,
    ACTIVE,
    SUSPENDED,
    REJECTED,
    DEACTIVATED;

    /**
     * Determines if a transition from the current state to target state is legally permissible.
     */
    public boolean canTransitionTo(PartnerStatus target) {
        if (target == null) {
            return false;
        }
        return switch (this) {
            case PENDING -> target == VERIFICATION || target == REJECTED;
            case VERIFICATION -> target == ACTIVE || target == REJECTED;
            case ACTIVE -> target == SUSPENDED || target == DEACTIVATED;
            case SUSPENDED -> target == ACTIVE || target == DEACTIVATED;
            case REJECTED, DEACTIVATED -> false; // Terminal states
        };
    }
}
