package com.project.partnerportal.service.impl;

import com.project.partnerportal.dto.PartnerResponse;
import com.project.partnerportal.dto.StatusHistoryResponse;
import com.project.partnerportal.dto.StatusUpdateRequest;
import com.project.partnerportal.entity.AuditLog;
import com.project.partnerportal.entity.DeliveryPartner;
import com.project.partnerportal.entity.PartnerStatus;
import com.project.partnerportal.entity.StatusHistory;
import com.project.partnerportal.exception.InvalidStatusTransitionException;
import com.project.partnerportal.exception.ResourceNotFoundException;
import com.project.partnerportal.repository.AuditLogRepository;
import com.project.partnerportal.repository.DeliveryPartnerRepository;
import com.project.partnerportal.repository.StatusHistoryRepository;
import com.project.partnerportal.service.PartnerStatusService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class PartnerStatusServiceImpl implements PartnerStatusService {

    private static final Logger log = LoggerFactory.getLogger(PartnerStatusServiceImpl.class);

    private final DeliveryPartnerRepository partnerRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final AuditLogRepository auditLogRepository;

    public PartnerStatusServiceImpl(DeliveryPartnerRepository partnerRepository,
                                    StatusHistoryRepository statusHistoryRepository,
                                    AuditLogRepository auditLogRepository) {
        this.partnerRepository = partnerRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    public PartnerResponse updatePartnerStatus(UUID partnerId, StatusUpdateRequest request, String actor, String clientIp) {
        log.info("Attempting status transition for partner id: {} to {} by actor: {}", partnerId, request.getTargetStatus(), actor);

        DeliveryPartner partner = partnerRepository.findById(partnerId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery partner not found with ID: " + partnerId));

        PartnerStatus currentStatus = partner.getCurrentStatus();
        PartnerStatus targetStatus = request.getTargetStatus();

        if (!currentStatus.canTransitionTo(targetStatus)) {
            String errorMsg = String.format("Illegal state transition from %s to %s is not permitted", currentStatus, targetStatus);
            log.warn("Invalid state transition attempt on partner {}: {}", partnerId, errorMsg);
            throw new InvalidStatusTransitionException(errorMsg);
        }

        partner.setCurrentStatus(targetStatus);
        if (targetStatus == PartnerStatus.DEACTIVATED || targetStatus == PartnerStatus.REJECTED) {
            partner.setActive(false);
        } else if (targetStatus == PartnerStatus.ACTIVE) {
            partner.setActive(true);
        }

        DeliveryPartner updatedPartner = partnerRepository.save(partner);

        // Record historical transition
        StatusHistory history = new StatusHistory(
                updatedPartner,
                currentStatus,
                targetStatus,
                request.getReason(),
                actor != null ? actor : "SYSTEM"
        );
        statusHistoryRepository.save(history);

        // Record audit trail
        AuditLog auditLog = new AuditLog(
                "DeliveryPartner",
                updatedPartner.getId(),
                "STATUS_CHANGE_" + targetStatus.name(),
                actor != null ? actor : "SYSTEM",
                clientIp != null ? clientIp : "127.0.0.1",
                String.format("Transitioned status from %s to %s. Reason: %s", currentStatus, targetStatus, request.getReason())
        );
        auditLogRepository.save(auditLog);

        return PartnerResponse.fromEntity(updatedPartner);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StatusHistoryResponse> getPartnerStatusHistory(UUID partnerId) {
        log.debug("Retrieving status transition history for partner id: {}", partnerId);
        if (!partnerRepository.existsById(partnerId)) {
            throw new ResourceNotFoundException("Delivery partner not found with ID: " + partnerId);
        }
        return statusHistoryRepository.findByPartnerIdOrderByCreatedAtDesc(partnerId)
                .stream()
                .map(StatusHistoryResponse::fromEntity)
                .toList();
    }
}
