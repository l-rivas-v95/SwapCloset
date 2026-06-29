package org.swapcloset.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns(
                        "https://localhost",
                        "http://localhost:8100",
                        "http://localhost:8101",
                        "http://localhost:*",
                        "http://127.0.0.1:*",
                        "capacitor://localhost",
                        "https://front-end-fwtp.onrender.com",
                        "https://*.onrender.com",
                        "https://lrivasvilla95.duckdns.org"
                )

                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "Content-Type", "Location")
                .allowCredentials(true)
                .maxAge(3600);
    }
}