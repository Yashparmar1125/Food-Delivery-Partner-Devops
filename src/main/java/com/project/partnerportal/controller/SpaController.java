package com.project.partnerportal.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Controller to forward client-side SPA routes to index.html
 * ensuring seamless direct URL navigation and browser refreshes.
 */
@Controller
public class SpaController {

    @GetMapping(value = {
            "/partners/**",
            "/dashboard/**",
            "/onboarding/**",
            "/analytics/**",
            "/audit/**"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
