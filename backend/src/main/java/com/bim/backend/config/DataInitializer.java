package com.bim.backend.config;

import com.bim.backend.entity.User;
import com.bim.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeData(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Create default admin user
            if (!userRepository.existsByUsername("admin")) {
                User adminUser = User.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .email("admin@bim.local")
                        .fullName("Administrator")
                        .role(User.Role.ADMIN)
                        .build();

                userRepository.save(adminUser);
                System.out.println("✓ Admin user created (username: admin, password: admin123)");
            } else {
                System.out.println("✓ Admin user already exists");
            }
        };
    }
}