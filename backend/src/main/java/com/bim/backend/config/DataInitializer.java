package com.bim.backend.config;

import com.bim.backend.entity.User;
import com.bim.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeData(UserRepository userRepository) {
        return args -> {
            // Check if system user already exists
            if (!userRepository.existsByUsername("system")) {
                User systemUser = User.builder()
                        .username("system")
                        .password("system123")
                        .email("system@bim.local")
                        .fullName("System User")
                        .build();

                userRepository.save(systemUser);
                System.out.println("✓ System user created successfully");
            } else {
                System.out.println("✓ System user already exists");
            }
        };
    }
}