package com.project.partnerportal.dto;

import com.project.partnerportal.entity.PartnerStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {

    @NotNull(message = "Target status is required")
    private PartnerStatus targetStatus;

    @NotBlank(message = "Reason for status change is required")
    private String reason;

    private String changedBy;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(PartnerStatus targetStatus, String reason, String changedBy) {
        this.targetStatus = targetStatus;
        this.reason = reason;
        this.changedBy = changedBy;
    }

    public PartnerStatus getTargetStatus() {
        return targetStatus;
    }

    public void setTargetStatus(PartnerStatus targetStatus) {
        this.targetStatus = targetStatus;
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
}
