package com.project.partnerportal.service;

import com.project.partnerportal.dto.PartnerResponse;
import com.project.partnerportal.dto.StatusHistoryResponse;
import com.project.partnerportal.dto.StatusUpdateRequest;

import java.util.List;
import java.util.UUID;

public interface PartnerStatusService {

    PartnerResponse updatePartnerStatus(UUID partnerId, StatusUpdateRequest request, String actor, String clientIp);

    List<StatusHistoryResponse> getPartnerStatusHistory(UUID partnerId);
}
