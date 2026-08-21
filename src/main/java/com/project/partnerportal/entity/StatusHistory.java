package com.project.partnerportal.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "status_history", indexes = {
        @Index(name = "idx_status_history_partner", columnList = "partner_id"),
        @Index(name = "idx_status_history_created", columnList = "created_at")
})
public class StatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "partner_id", nullable = false)
    private DeliveryPartner partner;

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status", length = 30)
    private PartnerStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false, length = 30)
    private PartnerStatus newStatus;

    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "changed_by", length = 100)
    private String changedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public StatusHistory() {
    }

    public StatusHistory(DeliveryPartner partner, PartnerStatus previousStatus, PartnerStatus newStatus,
                         String reason, String changedBy) {
        this.partner = partner;
        this.previousStatus = previousStatus;
        this.newStatus = newStatus;
        this.reason = reason;
        this.changedBy = changedBy;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public DeliveryPartner getPartner() {
        return partner;
    }

    public void setPartner(DeliveryPartner partner) {
        this.partner = partner;
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
