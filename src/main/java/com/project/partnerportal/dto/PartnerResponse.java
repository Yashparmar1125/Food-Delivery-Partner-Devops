package com.project.partnerportal.dto;

import com.project.partnerportal.entity.DeliveryPartner;
import com.project.partnerportal.entity.PartnerStatus;
import com.project.partnerportal.entity.VehicleType;

import java.time.LocalDateTime;
import java.util.UUID;

public class PartnerResponse {

    private UUID id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private VehicleType vehicleType;
    private String vehicleRegistrationNumber;
    private String licenseNumber;
    private String city;
    private PartnerStatus currentStatus;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PartnerResponse() {
    }

    public static PartnerResponse fromEntity(DeliveryPartner entity) {
        PartnerResponse dto = new PartnerResponse();
        dto.setId(entity.getId());
        dto.setFullName(entity.getFullName());
        dto.setEmail(entity.getEmail());
        dto.setPhoneNumber(entity.getPhoneNumber());
        dto.setVehicleType(entity.getVehicleType());
        dto.setVehicleRegistrationNumber(entity.getVehicleRegistrationNumber());
        dto.setLicenseNumber(entity.getLicenseNumber());
        dto.setCity(entity.getCity());
        dto.setCurrentStatus(entity.getCurrentStatus());
        dto.setActive(entity.isActive());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public VehicleType getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(VehicleType vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getVehicleRegistrationNumber() {
        return vehicleRegistrationNumber;
    }

    public void setVehicleRegistrationNumber(String vehicleRegistrationNumber) {
        this.vehicleRegistrationNumber = vehicleRegistrationNumber;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public PartnerStatus getCurrentStatus() {
        return currentStatus;
    }

    public void setCurrentStatus(PartnerStatus currentStatus) {
        this.currentStatus = currentStatus;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
