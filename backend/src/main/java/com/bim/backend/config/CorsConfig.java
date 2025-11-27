package com.bim.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Cross origin resource sharing
// Tells the backend: "Allow requests from localhost:5173 (the frontend)"
// Without it: Browser blocks requests from different origins (security feature)
// It's like saying: "Frontend at port 5173 is allowed to talk to me at port 8080"

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") //apply cors to all endpoints
                .allowedOrigins("http://localhost:5173") // only allow requests from react dev server
                .allowedMethods("*") // allow get post everything 
                .allowedHeaders("*") 
                .allowCredentials(true); // allow cookies, auth headers etc
    }
}
