package com.bim.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class OfferteRequest {

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

    // Custom rates (null = use default)
    private BigDecimal engineeringRatePct;
    private BigDecimal cncCltRatePerM2;
    private BigDecimal cncGlRatePerM3;
    private BigDecimal accessoiresRatePct;
    private BigDecimal montageRatePct;
    private BigDecimal transportRatePerTruck;

    // Fixed overrides (take priority over rate)
    private BigDecimal engineeringOverride;
    private BigDecimal cncCltOverride;
    private BigDecimal cncGlOverride;
    private BigDecimal accessoiresOverride;
    private BigDecimal montageOverride;
    private BigDecimal transportOverride;

    private List<OfferteLineItemDto> lineItems;
    private String notes;
}
