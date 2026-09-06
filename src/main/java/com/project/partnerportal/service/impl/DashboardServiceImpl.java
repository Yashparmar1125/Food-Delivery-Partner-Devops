package com.project.partnerportal.service.impl;

import com.project.partnerportal.dto.DashboardSummaryResponse;
import com.project.partnerportal.entity.PartnerStatus;
import com.project.partnerportal.repository.DeliveryPartnerRepository;
import com.project.partnerportal.service.DashboardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private static final Logger log = LoggerFactory.getLogger(DashboardServiceImpl.class);

    private final DeliveryPartnerRepository partnerRepository;

    public DashboardServiceImpl(DeliveryPartnerRepository partnerRepository) {
        this.partnerRepository = partnerRepository;
    }

    @Override
    public DashboardSummaryResponse getDashboardSummary() {
        log.debug("Calculating dashboard summary metrics");

        long total = partnerRepository.count();
        long active = partnerRepository.countByCurrentStatus(PartnerStatus.ACTIVE);
        long pending = partnerRepository.countByCurrentStatus(PartnerStatus.PENDING);
        long verification = partnerRepository.countByCurrentStatus(PartnerStatus.VERIFICATION);
        long suspended = partnerRepository.countByCurrentStatus(PartnerStatus.SUSPENDED);
        long rejected = partnerRepository.countByCurrentStatus(PartnerStatus.REJECTED);
        long deactivated = partnerRepository.countByCurrentStatus(PartnerStatus.DEACTIVATED);

        return new DashboardSummaryResponse(total, active, pending, verification, suspended, rejected, deactivated);
    }
}
