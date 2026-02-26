package com.bim.backend.controller;

import com.bim.backend.dto.CompanyRequest;
import com.bim.backend.dto.CompanyResponse;
import com.bim.backend.entity.Company;
import com.bim.backend.exception.ResourceNotFoundException;
import com.bim.backend.repository.CompanyRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyRepository companyRepository;

    public CompanyController(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @GetMapping
    public ResponseEntity<List<CompanyResponse>> getAllCompanies() {
        return ResponseEntity.ok(
                companyRepository.findAllByOrderByNameAsc()
                        .stream().map(this::mapToResponse).collect(Collectors.toList())
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyResponse> getCompany(@PathVariable Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        return ResponseEntity.ok(mapToResponse(company));
    }

    @PostMapping
    public ResponseEntity<CompanyResponse> createCompany(@RequestBody CompanyRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            return ResponseEntity.badRequest().build();
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
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(companyRepository.save(company)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyResponse> updateCompany(@PathVariable Long id, @RequestBody CompanyRequest request) {
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

        return ResponseEntity.ok(mapToResponse(companyRepository.save(company)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        companyRepository.delete(company);
        return ResponseEntity.noContent().build();
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
