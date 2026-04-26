package com.bim.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class OfferteResponse {

    private Long id;
    private String offerteNumber;
    private LocalDate date;
    private String preparedBy;
    private String projectDescription;
    private LocalDate submissionDeadline;
    private LocalDate validUntil;
    private String deliveryQuarter;
    private String status;

    // Client
    private String clientName;
    private String clientStreet;
    private String clientStreetNumber;
    private String clientPostcode;
    private String clientCity;
    private String clientVatNumber;

    // Site
    private String siteAddress;

    // Project details
    private String finishGrade;
    private String projectType;
    private Integer numberOfUnits;
    private String buildingDimensions;
    private Integer numberOfFloors;
    private String roofType;
    private String roofPitch;
    private String corniceHeight;
    private String ridgeHeight;
    private String ceilingHeightKelder;
    private String ceilingHeightGelijkvloers;
    private String ceilingHeightVerdiep1;
    private String ceilingHeightZolderverdiep;

    // Structure
    private BigDecimal cltM2;
    private BigDecimal cltPricePerM2;
    private BigDecimal glColumnsM3;
    private BigDecimal glColumnsPricePerM3;
    private BigDecimal glBeamsM3;
    private BigDecimal glBeamsPricePerM3;

    // Roostering
    private Boolean includeRoostring;
    private BigDecimal roosteringM2;
    private BigDecimal roosteringPricePerM2;

    // Transport
    private Integer numberOfTrucks;

    // Auto-calculated values
    private BigDecimal structuurTotal;
    private BigDecimal engineeringCost;
    private BigDecimal cncCltCost;
    private BigDecimal cncGlCost;
    private BigDecimal accessoiresCost;
    private BigDecimal roosteringTotal;
    private BigDecimal transportCost;
    private BigDecimal montageCost;
    private BigDecimal subtotalExclVat;
    private BigDecimal vat;
    private BigDecimal totalInclVat;

    // Overrides
    private BigDecimal engineeringOverride;
    private BigDecimal cncCltOverride;
    private BigDecimal cncGlOverride;
    private BigDecimal accessoiresOverride;
    private BigDecimal montageOverride;
    private BigDecimal transportOverride;

    private String notes;
    private String createdByName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
