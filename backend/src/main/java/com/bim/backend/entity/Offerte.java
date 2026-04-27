package com.bim.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "offertes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Offerte {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // General Info
    @Column(nullable = false, unique = true)
    private String offerteNumber; // e.g. 001/2025

    @Column(nullable = false)
    private LocalDate date;

    private String preparedBy;

    @Column(nullable = false)
    private String projectDescription;

    private LocalDate submissionDeadline;
    private LocalDate validUntil;
    private String deliveryQuarter;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private OfferteStatus status = OfferteStatus.DRAFT;

    // Client Info
    @Column(nullable = false)
    private String clientName;
    private String clientStreet;
    private String clientStreetNumber;
    private String clientPostcode;
    private String clientCity;
    private String clientVatNumber;

    // Construction Site
    private String siteAddress;

    // Project Details
    private String finishGrade;
    private String projectType;
    private Integer numberOfUnits;
    private String buildingDimensions;
    private Integer numberOfFloors;
    private String roofType;
    private String roofPitch;
    private String corniceHeight;
    private String ridgeHeight;

    // Ceiling heights per floor
    private String ceilingHeightKelder;
    private String ceilingHeightGelijkvloers;
    private String ceilingHeightVerdiep1;
    private String ceilingHeightZolderverdiep;

    // Structure â€” CLT
    private BigDecimal cltM2;
    private BigDecimal cltPricePerM2;

    // Structure â€” GL
    private BigDecimal glColumnsM3;
    private BigDecimal glColumnsPricePerM3;
    private BigDecimal glBeamsM3;
    private BigDecimal glBeamsPricePerM3;

    // Roostering (optional)
    private Boolean includeRoostring;
    private BigDecimal roosteringM2;
    private BigDecimal roosteringPricePerM2;

    // Transport
    private Integer numberOfTrucks;

    // Custom rates per offerte (null = use default)
    private BigDecimal engineeringRatePct;    // e.g. 5.0 means 5%
    private BigDecimal cncCltRatePerM2;       // e.g. 11.0
    private BigDecimal cncGlRatePerM3;        // e.g. 260.0
    private BigDecimal accessoiresRatePct;    // e.g. 12.0
    private BigDecimal montageRatePct;        // e.g. 22.0
    private BigDecimal transportRatePerTruck; // e.g. 2250.0

    // Fixed overrides — if set, take priority over rate
    private BigDecimal engineeringOverride;
    private BigDecimal cncCltOverride;
    private BigDecimal cncGlOverride;
    private BigDecimal accessoiresOverride;
    private BigDecimal montageOverride;
    private BigDecimal transportOverride;

    // Free-form line items
    @OneToMany(mappedBy = "offerte", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("sortOrder ASC, id ASC")
    @Builder.Default
    private List<OfferteLineItem> lineItems = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

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

    public enum OfferteStatus {
        DRAFT, SENT, PENDING, ACCEPTED, REJECTED
    }
}
