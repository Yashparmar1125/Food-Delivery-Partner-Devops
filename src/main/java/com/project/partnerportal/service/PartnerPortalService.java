package com.project.partnerportal.service;

import com.project.partnerportal.dto.DeliveryOrderDto;
import com.project.partnerportal.dto.PartnerMeResponse;
import com.project.partnerportal.dto.PartnerRegistrationDto;

import java.util.List;

public interface PartnerPortalService {

    PartnerMeResponse getMyProfile(String username);

    PartnerMeResponse updateDutyStatus(String username, boolean online);

    PartnerMeResponse reapplyKyc(String username, PartnerRegistrationDto dto);

    List<DeliveryOrderDto> getAvailableOrders(String username);

    PartnerMeResponse completeOrder(String username, String orderId, Double payout);
}
