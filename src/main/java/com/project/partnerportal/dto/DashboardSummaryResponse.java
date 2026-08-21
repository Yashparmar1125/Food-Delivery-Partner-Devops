package com.project.partnerportal.dto;

public class DashboardSummaryResponse {

    private long totalPartners;
    private long activePartners;
    private long pendingPartners;
    private long verificationPartners;
    private long suspendedPartners;
    private long rejectedPartners;
    private long deactivatedPartners;
    private double activeFleetPercentage;

    public DashboardSummaryResponse() {
    }

    public DashboardSummaryResponse(long totalPartners, long activePartners, long pendingPartners,
                                    long verificationPartners, long suspendedPartners,
                                    long rejectedPartners, long deactivatedPartners) {
        this.totalPartners = totalPartners;
        this.activePartners = activePartners;
        this.pendingPartners = pendingPartners;
        this.verificationPartners = verificationPartners;
        this.suspendedPartners = suspendedPartners;
        this.rejectedPartners = rejectedPartners;
        this.deactivatedPartners = deactivatedPartners;
        this.activeFleetPercentage = totalPartners > 0 ? ((double) activePartners / totalPartners) * 100.0 : 0.0;
    }

    public long getTotalPartners() {
        return totalPartners;
    }

    public void setTotalPartners(long totalPartners) {
        this.totalPartners = totalPartners;
    }

    public long getActivePartners() {
        return activePartners;
    }

    public void setActivePartners(long activePartners) {
        this.activePartners = activePartners;
    }

    public long getPendingPartners() {
        return pendingPartners;
    }

    public void setPendingPartners(long pendingPartners) {
        this.pendingPartners = pendingPartners;
    }

    public long getVerificationPartners() {
        return verificationPartners;
    }

    public void setVerificationPartners(long verificationPartners) {
        this.verificationPartners = verificationPartners;
    }

    public long getSuspendedPartners() {
        return suspendedPartners;
    }

    public void setSuspendedPartners(long suspendedPartners) {
        this.suspendedPartners = suspendedPartners;
    }

    public long getRejectedPartners() {
        return rejectedPartners;
    }

    public void setRejectedPartners(long rejectedPartners) {
        this.rejectedPartners = rejectedPartners;
    }

    public long getDeactivatedPartners() {
        return deactivatedPartners;
    }

    public void setDeactivatedPartners(long deactivatedPartners) {
        this.deactivatedPartners = deactivatedPartners;
    }

    public double getActiveFleetPercentage() {
        return activeFleetPercentage;
    }

    public void setActiveFleetPercentage(double activeFleetPercentage) {
        this.activeFleetPercentage = activeFleetPercentage;
    }
}
