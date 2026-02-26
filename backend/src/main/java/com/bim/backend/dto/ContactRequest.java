package com.bim.backend.dto;

import lombok.Data;

@Data
public class ContactRequest {
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
    private Long companyId; // optional
}
