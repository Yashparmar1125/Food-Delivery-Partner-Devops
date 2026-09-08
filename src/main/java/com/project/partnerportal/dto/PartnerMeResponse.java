package com.project.partnerportal.dto;

import com.project.partnerportal.entity.DeliveryPartner;
import com.project.partnerportal.entity.PartnerStatus;
import com.project.partnerportal.entity.VehicleType;

import java.time.LocalDateTime;
import java.util.UUID;

public class PartnerMeResponse {

    private UUID id;
    private String username;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String city;
    private VehicleType vehicleType;
    private String vehicleRegistrationNumber;
    private String licenseNumber;
    private String aadhaarNumber;
    private String upiId;
    private PartnerStatus currentStatus;
    private boolean isOnline;
    private Double totalEarnings;
    private Integer completedDeliveries;
    private LocalDateTime createdAt;
    private String rejectionReason;

    public PartnerMeResponse() {
    }

    public static PartnerMeResponse fromEntity(DeliveryPartner partner, String rejectionReason) {
        PartnerMeResponse res = new PartnerMeResponse();
        res.id = partner.getId();
        res.username = partner.getUser() != null ? partner.getUser().getUsername() : null;
        res.fullName = partner.getFullName();
        res.email = partner.getEmail();
        res.phoneNumber = partner.getPhoneNumber();
        res.city = partner.getCity();
        res.vehicleType = partner.getVehicleType();
        res.vehicleRegistrationNumber = partner.getVehicleRegistrationNumber();
        res.licenseNumber = partner.getLicenseNumber();
        res.aadhaarNumber = partner.getAadhaarNumber();
        res.upiId = partner.getUpiId();
        res.currentStatus = partner.getCurrentStatus();
        res.isOnline = partner.isOnline();
        res.totalEarnings = partner.getTotalEarnings();
        res.completedDeliveries = partner.getCompletedDeliveries();
        res.createdAt = partner.getCreatedAt();
        res.rejectionReason = rejectionReason;
        return res;
    }

    public UUID getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public String getCity() {
        return city;
    }

    public VehicleType getVehicleType() {
        return vehicleType;
    }

    public String getVehicleRegistrationNumber() {
        return vehicleRegistrationNumber;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public String getUpiId() {
        return upiId;
    }

    public PartnerStatus getCurrentStatus() {
        return currentStatus;
    }

    public boolean isOnline() {
        return isOnline;
    }

    public Double getTotalEarnings() {
        return totalEarnings;
    }

    public Integer getCompletedDeliveries() {
        return completedDeliveries;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }
}
