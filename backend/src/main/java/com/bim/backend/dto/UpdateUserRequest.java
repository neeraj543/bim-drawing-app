package com.bim.backend.dto;

import com.bim.backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String fullName;
    private String email;
    private User.Role role;
}