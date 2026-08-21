package com.project.partnerportal.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI partnerPortalOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Food Delivery Partner Portal API")
                        .description("REST API documentation for the Jenkins-Based Food Delivery Partner Portal project.")
                        .version("v1.0.0")
                        .contact(new Contact()
                                .name("Engineering & DevOps Team")
                                .email("devops-team@partnerportal.local"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")));
    }
}
