package com.project.partnerportal.dto;

import com.project.partnerportal.entity.PartnerStatus;
import com.project.partnerportal.entity.StatusHistory;

import java.time.LocalDateTime;
import java.util.UUID;

public class StatusHistoryResponse {
    private UUID id;
    private UUID partnerId;
    private PartnerStatus previousStatus;
    private PartnerStatus newStatus;
    private String reason;
    private String changedBy;
    private LocalDateTime createdAt;

    public StatusHistoryResponse() {
    }

    public static StatusHistoryResponse fromEntity(StatusHistory history) {
        StatusHistoryResponse dto = new StatusHistoryResponse();
        dto.setId(history.getId());
        dto.setPartnerId(history.getPartner().getId());
        dto.setPreviousStatus(history.getPreviousStatus());
        dto.setNewStatus(history.getNewStatus());
        dto.setReason(history.getReason());
        dto.setChangedBy(history.getChangedBy());
        dto.setCreatedAt(history.getCreatedAt());
        return dto;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(UUID partnerId) {
        this.partnerId = partnerId;
    }

    public PartnerStatus getPreviousStatus() {
        return previousStatus;
    }

    public void setPreviousStatus(PartnerStatus previousStatus) {
        this.previousStatus = previousStatus;
    }

    public PartnerStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(PartnerStatus newStatus) {
        this.newStatus = newStatus;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(String changedBy) {
        this.changedBy = changedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
