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
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        log.info("Checking and initializing default roles and system administrator...");

        Role adminRole = initRoleIfNotFound("ROLE_ADMIN", "Full system administrator privileges");
        initRoleIfNotFound("ROLE_OPS_MANAGER", "Operations manager with status transition authority");
        initRoleIfNotFound("ROLE_SUPPORT", "Support operations staff with partner onboarding authority");

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
    }

    private Role initRoleIfNotFound(String roleName, String description) {
        return roleRepository.findByName(roleName).orElseGet(() -> {
            Role role = new Role(roleName, description);
            return roleRepository.save(role);
        });
    }
}
