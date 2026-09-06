package com.project.partnerportal.service.impl;

import com.project.partnerportal.dto.PartnerRequest;
import com.project.partnerportal.dto.PartnerResponse;
import com.project.partnerportal.entity.*;
import com.project.partnerportal.exception.DuplicateResourceException;
import com.project.partnerportal.exception.ResourceNotFoundException;
import com.project.partnerportal.repository.AuditLogRepository;
import com.project.partnerportal.repository.DeliveryPartnerRepository;
import com.project.partnerportal.repository.StatusHistoryRepository;
import com.project.partnerportal.service.PartnerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class PartnerServiceImpl implements PartnerService {

    private static final Logger log = LoggerFactory.getLogger(PartnerServiceImpl.class);

    private final DeliveryPartnerRepository partnerRepository;
    private final StatusHistoryRepository statusHistoryRepository;
    private final AuditLogRepository auditLogRepository;

    public PartnerServiceImpl(DeliveryPartnerRepository partnerRepository,
                              StatusHistoryRepository statusHistoryRepository,
                              AuditLogRepository auditLogRepository) {
        this.partnerRepository = partnerRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    public PartnerResponse createPartner(PartnerRequest request, String performedBy, String clientIp) {
        log.info("Creating delivery partner with email: {} by actor: {}", request.getEmail(), performedBy);

        if (partnerRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Partner with email '" + request.getEmail() + "' already exists");
        }
        if (partnerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateResourceException("Partner with phone number '" + request.getPhoneNumber() + "' already exists");
        }
        if (request.getVehicleRegistrationNumber() != null && !request.getVehicleRegistrationNumber().isBlank()
                && partnerRepository.existsByVehicleRegistrationNumber(request.getVehicleRegistrationNumber())) {
            throw new DuplicateResourceException("Partner with vehicle registration '" + request.getVehicleRegistrationNumber() + "' already exists");
        }

        DeliveryPartner partner = new DeliveryPartner(
                request.getFullName(),
                request.getEmail(),
                request.getPhoneNumber(),
                request.getVehicleType(),
                request.getVehicleRegistrationNumber(),
                request.getLicenseNumber(),
                request.getCity()
        );
        partner.setCurrentStatus(PartnerStatus.PENDING);
        partner.setActive(true);

        DeliveryPartner savedPartner = partnerRepository.save(partner);

        // Record initial status history
        StatusHistory initialHistory = new StatusHistory(
                savedPartner,
                null,
                PartnerStatus.PENDING,
                "Initial partner onboarding registration",
                performedBy != null ? performedBy : "SYSTEM"
        );
        statusHistoryRepository.save(initialHistory);

        // Record audit log
        AuditLog auditLog = new AuditLog(
                "DeliveryPartner",
                savedPartner.getId(),
                "CREATE_PARTNER",
                performedBy != null ? performedBy : "SYSTEM",
                clientIp != null ? clientIp : "127.0.0.1",
                "Created new partner profile with PENDING status"
        );
        auditLogRepository.save(auditLog);

        return PartnerResponse.fromEntity(savedPartner);
    }

    @Override
    @Transactional(readOnly = true)
    public PartnerResponse getPartnerById(UUID id) {
        log.debug("Fetching delivery partner by id: {}", id);
        DeliveryPartner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery partner not found with ID: " + id));
        return PartnerResponse.fromEntity(partner);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PartnerResponse> getAllPartners(Pageable pageable) {
        log.debug("Fetching paginated delivery partners: page={}, size={}", pageable.getPageNumber(), pageable.getPageSize());
        return partnerRepository.findAll(pageable).map(PartnerResponse::fromEntity);
    }

    @Override
    public PartnerResponse updatePartner(UUID id, PartnerRequest request, String performedBy, String clientIp) {
        log.info("Updating delivery partner id: {} by actor: {}", id, performedBy);
        DeliveryPartner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery partner not found with ID: " + id));

        // Check email conflict if updated
        if (!partner.getEmail().equalsIgnoreCase(request.getEmail()) && partnerRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' is already registered to another partner");
        }

        // Check phone conflict if updated
        if (!partner.getPhoneNumber().equals(request.getPhoneNumber()) && partnerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateResourceException("Phone number '" + request.getPhoneNumber() + "' is already registered to another partner");
        }

        // Check vehicle registration conflict if updated
        if (request.getVehicleRegistrationNumber() != null && !request.getVehicleRegistrationNumber().isBlank()) {
            if (!request.getVehicleRegistrationNumber().equalsIgnoreCase(partner.getVehicleRegistrationNumber())
                    && partnerRepository.existsByVehicleRegistrationNumber(request.getVehicleRegistrationNumber())) {
                throw new DuplicateResourceException("Vehicle registration '" + request.getVehicleRegistrationNumber() + "' is already registered");
            }
        }

        partner.setFullName(request.getFullName());
        partner.setEmail(request.getEmail());
        partner.setPhoneNumber(request.getPhoneNumber());
        partner.setVehicleType(request.getVehicleType());
        partner.setVehicleRegistrationNumber(request.getVehicleRegistrationNumber());
        partner.setLicenseNumber(request.getLicenseNumber());
        partner.setCity(request.getCity());

        DeliveryPartner updatedPartner = partnerRepository.save(partner);

        // Record audit log
        AuditLog auditLog = new AuditLog(
                "DeliveryPartner",
                updatedPartner.getId(),
                "UPDATE_PARTNER",
                performedBy != null ? performedBy : "SYSTEM",
                clientIp != null ? clientIp : "127.0.0.1",
                "Updated profile details for partner: " + updatedPartner.getFullName()
        );
        auditLogRepository.save(auditLog);

        return PartnerResponse.fromEntity(updatedPartner);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PartnerResponse> searchPartners(String name, String phone, PartnerStatus status, VehicleType vehicleType, Pageable pageable) {
        log.debug("Searching partners with filters - name: {}, phone: {}, status: {}, vehicleType: {}", name, phone, status, vehicleType);
        return partnerRepository.searchPartners(name, phone, status, vehicleType, pageable).map(PartnerResponse::fromEntity);
    }

    @Override
    public void deletePartner(UUID id, String performedBy, String clientIp) {
        log.info("Deactivating delivery partner id: {} by actor: {}", id, performedBy);
        DeliveryPartner partner = partnerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery partner not found with ID: " + id));

        partner.setActive(false);
        partner.setCurrentStatus(PartnerStatus.DEACTIVATED);
        partnerRepository.save(partner);

        StatusHistory history = new StatusHistory(
                partner,
                partner.getCurrentStatus(),
                PartnerStatus.DEACTIVATED,
                "Partner deactivated / soft-deleted",
                performedBy != null ? performedBy : "SYSTEM"
        );
        statusHistoryRepository.save(history);

        AuditLog auditLog = new AuditLog(
                "DeliveryPartner",
                partner.getId(),
                "DEACTIVATE_PARTNER",
                performedBy != null ? performedBy : "SYSTEM",
                clientIp != null ? clientIp : "127.0.0.1",
                "Deactivated partner profile"
        );
        auditLogRepository.save(auditLog);
    }
}
