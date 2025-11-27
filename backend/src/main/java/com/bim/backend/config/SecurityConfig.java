package com.bim.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

// Manages authentication & authorization (who can access what)
// We disabled it temporarily: permitAll() = everyone can access everything
// It was blocking CORS because Spring Security checks requests BEFORE CORS rules apply
// So we had to tell Security: "Allow all requests without authentication"


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.disable()) // disable cors handling
            .csrf(csrf -> csrf.disable()) // disable csrf protection
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll()); //allow all request to everywhere, no auth or login as of yet

        return http.build();
    }
}