package com.bim.backend.service;

import com.bim.backend.dto.CompanyRequest;
import com.bim.backend.dto.CompanyResponse;
import com.bim.backend.entity.Company;
import com.bim.backend.exception.ResourceNotFoundException;
import com.bim.backend.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    @Autowired
    private CompanyRepository companyRepository;

    public List<CompanyResponse> getAllCompanies() {
        return companyRepository.findAllByOrderByNameAsc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public CompanyResponse getCompany(Long id) {
        return mapToResponse(companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id)));
    }

    public CompanyResponse createCompany(CompanyRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Company name is required");
        }
        Company company = Company.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .website(request.getWebsite())
                .vatNumber(request.getVatNumber())
                .street(request.getStreet())
                .streetNumber(request.getStreetNumber())
                .postcode(request.getPostcode())
                .city(request.getCity())
                .country(request.getCountry() != null ? request.getCountry() : "België")
                .notes(request.getNotes())
                .build();
        return mapToResponse(companyRepository.save(company));
    }

    public CompanyResponse updateCompany(Long id, CompanyRequest request) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        if (request.getName() != null) company.setName(request.getName());
        if (request.getEmail() != null) company.setEmail(request.getEmail());
        if (request.getPhone() != null) company.setPhone(request.getPhone());
        if (request.getWebsite() != null) company.setWebsite(request.getWebsite());
        if (request.getVatNumber() != null) company.setVatNumber(request.getVatNumber());
        if (request.getStreet() != null) company.setStreet(request.getStreet());
        if (request.getStreetNumber() != null) company.setStreetNumber(request.getStreetNumber());
        if (request.getPostcode() != null) company.setPostcode(request.getPostcode());
        if (request.getCity() != null) company.setCity(request.getCity());
        if (request.getCountry() != null) company.setCountry(request.getCountry());
        if (request.getNotes() != null) company.setNotes(request.getNotes());
        return mapToResponse(companyRepository.save(company));
    }

    public void deleteCompany(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        companyRepository.delete(company);
    }

    private CompanyResponse mapToResponse(Company c) {
        return CompanyResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .email(c.getEmail())
                .phone(c.getPhone())
                .website(c.getWebsite())
                .vatNumber(c.getVatNumber())
                .street(c.getStreet())
                .streetNumber(c.getStreetNumber())
                .postcode(c.getPostcode())
                .city(c.getCity())
                .country(c.getCountry())
                .notes(c.getNotes())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
