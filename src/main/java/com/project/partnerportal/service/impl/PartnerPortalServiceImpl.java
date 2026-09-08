package com.project.partnerportal.service.impl;

import com.project.partnerportal.dto.DeliveryOrderDto;
import com.project.partnerportal.dto.PartnerMeResponse;
import com.project.partnerportal.dto.PartnerRegistrationDto;
import com.project.partnerportal.entity.AuditLog;
import com.project.partnerportal.entity.DeliveryPartner;
import com.project.partnerportal.entity.PartnerStatus;
import com.project.partnerportal.entity.StatusHistory;
import com.project.partnerportal.exception.ResourceNotFoundException;
import com.project.partnerportal.repository.AuditLogRepository;
import com.project.partnerportal.repository.DeliveryPartnerRepository;
import com.project.partnerportal.repository.StatusHistoryRepository;
import com.project.partnerportal.service.PartnerPortalService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PartnerPortalServiceImpl implements PartnerPortalService {

    private static final Logger log = LoggerFactory.getLogger(PartnerPortalServiceImpl.class);

    private final DeliveryPartnerRepository partnerRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final AuditLogRepository auditLogRepository;

    public PartnerPortalServiceImpl(DeliveryPartnerRepository partnerRepository,
                                    StatusHistoryRepository statusHistoryRepository,
                                    AuditLogRepository auditLogRepository) {
        this.partnerRepository = partnerRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PartnerMeResponse getMyProfile(String username) {
        DeliveryPartner partner = partnerRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("No delivery partner profile found for username: " + username));

        String rejectionReason = null;
        if (partner.getCurrentStatus() == PartnerStatus.REJECTED) {
            List<StatusHistory> history = statusHistoryRepository.findByPartnerIdOrderByCreatedAtDesc(partner.getId());
            if (!history.isEmpty()) {
                rejectionReason = history.get(0).getReason();
            }
        }

        return PartnerMeResponse.fromEntity(partner, rejectionReason);
    }

    @Override
    @Transactional
    public PartnerMeResponse updateDutyStatus(String username, boolean online) {
        DeliveryPartner partner = partnerRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("No delivery partner profile found for username: " + username));

        if (partner.getCurrentStatus() != PartnerStatus.ACTIVE && online) {
            throw new IllegalStateException("Only active verified delivery partners can go online. Current status: " + partner.getCurrentStatus());
        }

        partner.setOnline(online);
        DeliveryPartner updated = partnerRepository.save(partner);

        log.info("Partner '{}' changed online duty status to {}", username, online);
        return PartnerMeResponse.fromEntity(updated, null);
    }

    @Override
    @Transactional
    public PartnerMeResponse reapplyKyc(String username, PartnerRegistrationDto dto) {
        DeliveryPartner partner = partnerRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("No delivery partner profile found for username: " + username));

        partner.setFullName(dto.getFullName());
        partner.setPhoneNumber(dto.getPhoneNumber());
        partner.setCity(dto.getCity());
        partner.setVehicleType(dto.getVehicleType());
        partner.setVehicleRegistrationNumber(dto.getVehicleRegistrationNumber());
        partner.setLicenseNumber(dto.getLicenseNumber());
        partner.setAadhaarNumber(dto.getAadhaarNumber());
        partner.setUpiId(dto.getUpiId());
        partner.setCurrentStatus(PartnerStatus.PENDING);
        partner.setOnline(false);

        DeliveryPartner saved = partnerRepository.save(partner);

        AuditLog audit = new AuditLog(
                "DeliveryPartner",
                saved.getId(),
                "REAPPLY_KYC",
                username,
                "127.0.0.1",
                "Partner re-submitted KYC documents for verification"
        );
        auditLogRepository.save(audit);

        return PartnerMeResponse.fromEntity(saved, null);
    }

    @Override
    public List<DeliveryOrderDto> getAvailableOrders(String username) {
        List<DeliveryOrderDto> orders = new ArrayList<>();
        orders.add(new DeliveryOrderDto(
                "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                "Burger King - Central Hub",
                "Store #14, High Street Mall, Food Court",
                "Ananya Deshmukh",
                "Flat 402, Green Meadows, Sector 12",
                75.0,
                2.8,
                "READY_FOR_PICKUP",
                3
        ));
        orders.add(new DeliveryOrderDto(
                "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                "Subway Fresh Eats",
                "Ground Floor, Tech Park Avenue",
                "Vikram Malhotra",
                "Tower B, Prestige Lakeview Apt 901",
                92.5,
                4.2,
                "READY_FOR_PICKUP",
                2
        ));
        orders.add(new DeliveryOrderDto(
                "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                "Pizza Express Gourmet",
                "Shop 8, Galleria Market",
                "Rohan Verma",
                "House 24, Phase 3, Palm Boulevard",
                110.0,
                5.1,
                "READY_FOR_PICKUP",
                4
        ));
        return orders;
    }

    @Override
    @Transactional
    public PartnerMeResponse completeOrder(String username, String orderId, Double payout) {
        DeliveryPartner partner = partnerRepository.findByUserUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("No delivery partner profile found for username: " + username));

        double earned = payout != null && payout > 0 ? payout : 65.0;
        partner.setTotalEarnings(partner.getTotalEarnings() + earned);
        partner.setCompletedDeliveries(partner.getCompletedDeliveries() + 1);

        DeliveryPartner saved = partnerRepository.save(partner);

        AuditLog audit = new AuditLog(
                "DeliveryOrder",
                saved.getId(),
                "DELIVERY_COMPLETED",
                username,
                "127.0.0.1",
                "Completed order " + orderId + " - Earned ₹" + earned
        );
        auditLogRepository.save(audit);

        return PartnerMeResponse.fromEntity(saved, null);
    }
}
