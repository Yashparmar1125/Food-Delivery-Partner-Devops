package com.project.partnerportal.service;

import com.project.partnerportal.dto.PartnerRequest;
import com.project.partnerportal.dto.PartnerResponse;
import com.project.partnerportal.entity.PartnerStatus;
import com.project.partnerportal.entity.VehicleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface PartnerService {

    PartnerResponse createPartner(PartnerRequest request, String performedBy, String clientIp);

    PartnerResponse getPartnerById(UUID id);

    Page<PartnerResponse> getAllPartners(Pageable pageable);

    PartnerResponse updatePartner(UUID id, PartnerRequest request, String performedBy, String clientIp);

    Page<PartnerResponse> searchPartners(String name, String phone, PartnerStatus status, VehicleType vehicleType, Pageable pageable);

    void deletePartner(UUID id, String performedBy, String clientIp);
}
