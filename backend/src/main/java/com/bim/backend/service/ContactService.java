package com.bim.backend.service;

import com.bim.backend.dto.ContactRequest;
import com.bim.backend.dto.ContactResponse;
import com.bim.backend.entity.Company;
import com.bim.backend.entity.Contact;
import com.bim.backend.exception.ResourceNotFoundException;
import com.bim.backend.repository.CompanyRepository;
import com.bim.backend.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactService {

    @Autowired
    private ContactRepository contactRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public List<ContactResponse> getAllContacts() {
        return contactRepository.findAllByOrderByLastNameAscFirstNameAsc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ContactResponse getContact(Long id) {
        return mapToResponse(contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id)));
    }

    public ContactResponse createContact(ContactRequest request) {
        if (request.getLastName() == null || request.getLastName().isBlank()) {
            throw new IllegalArgumentException("Last name is required");
        }

        Company company = null;
        if (request.getCompanyId() != null) {
            company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + request.getCompanyId()));
        }

        Contact contact = Contact.builder()
                .salutation(request.getSalutation() != null ? Contact.Salutation.valueOf(request.getSalutation()) : null)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .jobTitle(request.getJobTitle())
                .email(request.getEmail())
                .phone(request.getPhone())
                .mobile(request.getMobile())
                .website(request.getWebsite())
                .street(request.getStreet())
                .streetNumber(request.getStreetNumber())
                .postcode(request.getPostcode())
                .city(request.getCity())
                .country(request.getCountry() != null ? request.getCountry() : "België")
                .notes(request.getNotes())
                .company(company)
                .build();

        return mapToResponse(contactRepository.save(contact));
    }

    public ContactResponse updateContact(Long id, ContactRequest request) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));

        if (request.getSalutation() != null) contact.setSalutation(Contact.Salutation.valueOf(request.getSalutation()));
        if (request.getFirstName() != null) contact.setFirstName(request.getFirstName());
        if (request.getLastName() != null) contact.setLastName(request.getLastName());
        if (request.getJobTitle() != null) contact.setJobTitle(request.getJobTitle());
        if (request.getEmail() != null) contact.setEmail(request.getEmail());
        if (request.getPhone() != null) contact.setPhone(request.getPhone());
        if (request.getMobile() != null) contact.setMobile(request.getMobile());
        if (request.getWebsite() != null) contact.setWebsite(request.getWebsite());
        if (request.getStreet() != null) contact.setStreet(request.getStreet());
        if (request.getStreetNumber() != null) contact.setStreetNumber(request.getStreetNumber());
        if (request.getPostcode() != null) contact.setPostcode(request.getPostcode());
        if (request.getCity() != null) contact.setCity(request.getCity());
        if (request.getCountry() != null) contact.setCountry(request.getCountry());
        if (request.getNotes() != null) contact.setNotes(request.getNotes());

        if (request.getCompanyId() != null) {
            Company company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + request.getCompanyId()));
            contact.setCompany(company);
        } else {
            contact.setCompany(null);
        }

        return mapToResponse(contactRepository.save(contact));
    }

    public void deleteContact(Long id) {
        Contact contact = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
        contactRepository.delete(contact);
    }

    private ContactResponse mapToResponse(Contact c) {
        return ContactResponse.builder()
                .id(c.getId())
                .salutation(c.getSalutation() != null ? c.getSalutation().name() : null)
                .firstName(c.getFirstName())
                .lastName(c.getLastName())
                .jobTitle(c.getJobTitle())
                .email(c.getEmail())
                .phone(c.getPhone())
                .mobile(c.getMobile())
                .website(c.getWebsite())
                .street(c.getStreet())
                .streetNumber(c.getStreetNumber())
                .postcode(c.getPostcode())
                .city(c.getCity())
                .country(c.getCountry())
                .notes(c.getNotes())
                .companyId(c.getCompany() != null ? c.getCompany().getId() : null)
                .companyName(c.getCompany() != null ? c.getCompany().getName() : null)
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
