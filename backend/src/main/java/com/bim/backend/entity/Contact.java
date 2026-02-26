package com.bim.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "contacts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contact {

    public enum Salutation {
        MR, MRS, DR, PROF, IR
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Salutation salutation;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "job_title")
    private String jobTitle;

    private String email;
    private String phone;
    private String mobile;
    private String website;

    @Column(name = "vat_number")
    private String vatNumber;

    private String street;

    @Column(name = "street_number")
    private String streetNumber;

    private String postcode;
    private String city;

    @Builder.Default
    private String country = "België";

    @Column(columnDefinition = "TEXT")
    private String notes;

    // Optional link to a company
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
