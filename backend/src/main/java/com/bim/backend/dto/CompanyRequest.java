package com.bim.backend.dto;

import lombok.Data;

@Data
public class CompanyRequest {
    private String name;
    private String email;
    private String phone;
    private String website;
    private String vatNumber;
    private String street;
    private String streetNumber;
    private String postcode;
    private String city;
    private String country;
    private String notes;
}
