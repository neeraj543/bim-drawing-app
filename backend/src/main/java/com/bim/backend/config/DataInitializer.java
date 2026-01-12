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

            // Create test user 1
            if (!userRepository.existsByUsername("john")) {
                User user1 = User.builder()
                        .username("john")
                        .password(passwordEncoder.encode("password123"))
                        .email("john@bim.local")
                        .fullName("John Smith")
                        .role(User.Role.USER)
                        .build();

                userRepository.save(user1);
                System.out.println("✓ Test user created (username: john, password: password123)");
            }

            // Create test user 2
            if (!userRepository.existsByUsername("sarah")) {
                User user2 = User.builder()
                        .username("sarah")
                        .password(passwordEncoder.encode("password123"))
                        .email("sarah@bim.local")
                        .fullName("Sarah Johnson")
                        .role(User.Role.USER)
                        .build();

                userRepository.save(user2);
                System.out.println("✓ Test user created (username: sarah, password: password123)");
            }
        };
    }
}