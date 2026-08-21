package com.project.partnerportal.repository;

import com.project.partnerportal.entity.DeliveryPartner;
import com.project.partnerportal.entity.PartnerStatus;
import com.project.partnerportal.entity.VehicleType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface DeliveryPartnerRepository extends JpaRepository<DeliveryPartner, UUID> {

    Optional<DeliveryPartner> findByEmail(String email);

    Optional<DeliveryPartner> findByPhoneNumber(String phoneNumber);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

    boolean existsByVehicleRegistrationNumber(String vehicleRegistrationNumber);

    long countByCurrentStatus(PartnerStatus status);

    @Query("SELECT p FROM DeliveryPartner p WHERE " +
            "(:name IS NULL OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:phone IS NULL OR p.phoneNumber LIKE CONCAT('%', :phone, '%')) AND " +
            "(:status IS NULL OR p.currentStatus = :status) AND " +
            "(:vehicleType IS NULL OR p.vehicleType = :vehicleType)")
    Page<DeliveryPartner> searchPartners(
            @Param("name") String name,
            @Param("phone") String phone,
            @Param("status") PartnerStatus status,
            @Param("vehicleType") VehicleType vehicleType,
            Pageable pageable
    );
}
