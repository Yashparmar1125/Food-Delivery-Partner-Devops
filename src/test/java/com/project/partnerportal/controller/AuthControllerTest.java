package com.project.partnerportal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.partnerportal.config.SecurityConfig;
import com.project.partnerportal.dto.LoginRequest;
import com.project.partnerportal.dto.RegisterRequest;
import com.project.partnerportal.entity.Role;
import com.project.partnerportal.entity.User;
import com.project.partnerportal.repository.RoleRepository;
import com.project.partnerportal.repository.UserRepository;
import com.project.partnerportal.security.JwtAuthenticationFilter;
import com.project.partnerportal.security.JwtUtils;
import com.project.partnerportal.security.UserPrincipal;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private RoleRepository roleRepository;

    @MockBean
    private PasswordEncoder passwordEncoder;

    @MockBean
    private JwtUtils jwtUtils;

    @MockBean
    private UserDetailsService userDetailsService;

    @Test
    @DisplayName("POST /api/v1/auth/login should authenticate and return JWT token")
    void testLogin_Success() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin", "Admin@123");

        UserPrincipal principal = new UserPrincipal(
                UUID.randomUUID(),
                "admin",
                "admin@test.com",
                "encodedPassword",
                true,
                List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))
        );

        Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        when(authenticationManager.authenticate(any())).thenReturn(auth);
        when(jwtUtils.generateToken(any())).thenReturn("mock.jwt.token");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("mock.jwt.token"))
                .andExpect(jsonPath("$.data.username").value("admin"));
    }

    @Test
    @DisplayName("POST /api/v1/auth/register should create user and return 201")
    void testRegister_Success() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest(
                "opsuser",
                "ops@test.com",
                "Password123",
                "Ops",
                "User",
                Set.of("OPS_MANAGER")
        );

        when(userRepository.existsByUsername("opsuser")).thenReturn(false);
        when(userRepository.existsByEmail("ops@test.com")).thenReturn(false);
        when(roleRepository.findByName("ROLE_OPS_MANAGER")).thenReturn(Optional.of(new Role("ROLE_OPS_MANAGER", "Ops")));
        when(passwordEncoder.encode(any())).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").value("opsuser"));
    }
}
