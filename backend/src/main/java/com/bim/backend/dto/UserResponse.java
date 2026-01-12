package com.bim.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String fullName;
    private String email;

    /**
     * Get initials from username (first 3 characters uppercase)
     * Example: "edpUser" -> "EDP"
     */
    public String getInitials() {
        if (username == null || username.isEmpty()) {
            return "";
        }
        // Take first 3 characters and uppercase them
        int length = Math.min(3, username.length());
        return username.substring(0, length).toUpperCase();
    }
}
