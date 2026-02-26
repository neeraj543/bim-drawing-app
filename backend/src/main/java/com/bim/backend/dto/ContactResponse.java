package com.bim.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactResponse {
    private Long id;
    private String salutation;
    private String firstName;
    private String lastName;
    private String jobTitle;
    private String email;
    private String phone;
    private String mobile;
    private String website;
    private String vatNumber;
    private String street;
    private String streetNumber;
    private String postcode;
    private String city;
    private String country;
    private String notes;
    private Long companyId;
    private String companyName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
