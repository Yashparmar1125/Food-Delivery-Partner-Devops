package com.project.partnerportal.config;

import com.project.partnerportal.entity.Role;
import com.project.partnerportal.entity.User;
import com.project.partnerportal.repository.RoleRepository;
import com.project.partnerportal.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final com.project.partnerportal.repository.DeliveryPartnerRepository deliveryPartnerRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           com.project.partnerportal.repository.DeliveryPartnerRepository deliveryPartnerRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.deliveryPartnerRepository = deliveryPartnerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("Checking and initializing default roles and accounts...");

        Role adminRole = initRoleIfNotFound("ROLE_ADMIN", "Full system administrator privileges");
        Role opsRole = initRoleIfNotFound("ROLE_OPS_MANAGER", "Operations manager with status transition authority");
        initRoleIfNotFound("ROLE_SUPPORT", "Support operations staff with partner onboarding authority");
        Role partnerRole = initRoleIfNotFound("ROLE_PARTNER", "Delivery partner with self-service rider and delivery authority");

        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                    "admin",
                    "admin@partnerportal.local",
                    passwordEncoder.encode("Admin@123"),
                    "System",
                    "Administrator"
            );
            admin.setRoles(Set.of(adminRole));
            userRepository.save(admin);
            log.info("Default administrator account seeded: username 'admin'");
        }

        if (!userRepository.existsByUsername("ops_manager")) {
            User ops = new User(
                    "ops_manager",
                    "ops@partnerportal.local",
                    passwordEncoder.encode("Ops@123"),
                    "Operations",
                    "Manager"
            );
            ops.setRoles(Set.of(opsRole));
            userRepository.save(ops);
            log.info("Default operations manager seeded: username 'ops_manager'");
        }

        if (!userRepository.existsByUsername("rider_rajesh")) {
            User rider = new User(
                    "rider_rajesh",
                    "rajesh.rider@example.com",
                    passwordEncoder.encode("Partner@123"),
                    "Rajesh",
                    "Kumar"
            );
            rider.setRoles(Set.of(partnerRole));
            User savedRider = userRepository.save(rider);

            com.project.partnerportal.entity.DeliveryPartner dp = new com.project.partnerportal.entity.DeliveryPartner(
                    "Rajesh Kumar",
                    "rajesh.rider@example.com",
                    "9876543210",
                    com.project.partnerportal.entity.VehicleType.MOTORCYCLE,
                    "MH02AB1234",
                    "DL-1420110012345",
                    "Mumbai"
            );
            dp.setUser(savedRider);
            dp.setCurrentStatus(com.project.partnerportal.entity.PartnerStatus.ACTIVE);
            dp.setOnline(true);
            dp.setTotalEarnings(450.0);
            dp.setCompletedDeliveries(6);
            dp.setUpiId("rajesh@okhdfcbank");
            dp.setAadhaarNumber("9876-5432-1098");
            deliveryPartnerRepository.save(dp);
            log.info("Demo active delivery partner seeded: username 'rider_rajesh'");
        }
    }

    private Role initRoleIfNotFound(String roleName, String description) {
        return roleRepository.findByName(roleName).orElseGet(() -> {
            Role role = new Role(roleName, description);
            return roleRepository.save(role);
        });
    }
}
