package com.project.partnerportal.config;

import com.project.partnerportal.security.JwtAuthenticationFilter;
import com.project.partnerportal.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(@Autowired(required = false) JwtUtils jwtUtils,
                          @Autowired(required = false) UserDetailsService userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(
                                "/actuator/**",
                                "/api/v1/health/**",
                                "/api/v1/auth/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/api-docs/**",
                                "/v3/api-docs/**"
                        ).permitAll()
                        // Status transitions require Admin or Operations Manager
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/partners/*/status")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_OPS_MANAGER")
                        // Partner modifications
                        .requestMatchers(HttpMethod.POST, "/api/v1/partners")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_OPS_MANAGER", "ROLE_SUPPORT")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/partners/*")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_OPS_MANAGER")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/partners/*")
                        .hasAnyAuthority("ROLE_ADMIN")
                        // Dashboard and Read operations
                        .requestMatchers("/api/v1/partners/**", "/api/v1/dashboard/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_OPS_MANAGER", "ROLE_SUPPORT")
                        .anyRequest().authenticated()
                );

        if (jwtUtils != null && userDetailsService != null) {
            JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtUtils, userDetailsService);
            http.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);
        }

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
