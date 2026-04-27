package com.bim.backend.service;

import com.bim.backend.dto.OfferteLineItemDto;
import com.bim.backend.dto.OfferteRequest;
import com.bim.backend.dto.OfferteResponse;
import com.bim.backend.entity.Offerte;
import com.bim.backend.entity.OfferteLineItem;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class OfferteMapper {

    private static final BigDecimal DEFAULT_CNC_CLT_RATE    = new BigDecimal("11.00");
    private static final BigDecimal DEFAULT_CNC_GL_RATE     = new BigDecimal("260.00");
    private static final BigDecimal DEFAULT_TRANSPORT_RATE  = new BigDecimal("2250.00");
    private static final BigDecimal DEFAULT_ENGINEERING_PCT = new BigDecimal("5.0");
    private static final BigDecimal DEFAULT_ACCESSORIES_PCT = new BigDecimal("12.0");
    private static final BigDecimal DEFAULT_MONTAGE_PCT     = new BigDecimal("22.0");
    private static final BigDecimal DEFAULT_VAT_PCT         = new BigDecimal("21.0");
    private static final BigDecimal HUNDRED                 = new BigDecimal("100");

    public Offerte buildOfferte(Offerte offerte, OfferteRequest req) {
        offerte.setOfferteNumber(req.getOfferteNumber());
        offerte.setDate(req.getDate() != null ? req.getDate() : LocalDate.now());
        offerte.setPreparedBy(req.getPreparedBy());
        offerte.setProjectDescription(req.getProjectDescription());
        offerte.setSubmissionDeadline(req.getSubmissionDeadline());
        offerte.setValidUntil(req.getValidUntil());
        offerte.setDeliveryQuarter(req.getDeliveryQuarter());
        if (req.getStatus() != null) offerte.setStatus(Offerte.OfferteStatus.valueOf(req.getStatus()));
        offerte.setClientName(req.getClientName());
        offerte.setClientStreet(req.getClientStreet());
        offerte.setClientStreetNumber(req.getClientStreetNumber());
        offerte.setClientPostcode(req.getClientPostcode());
        offerte.setClientCity(req.getClientCity());
        offerte.setClientVatNumber(req.getClientVatNumber());
        offerte.setSiteAddress(req.getSiteAddress());
        offerte.setFinishGrade(req.getFinishGrade());
        offerte.setProjectType(req.getProjectType());
        offerte.setNumberOfUnits(req.getNumberOfUnits());
        offerte.setBuildingDimensions(req.getBuildingDimensions());
        offerte.setNumberOfFloors(req.getNumberOfFloors());
        offerte.setRoofType(req.getRoofType());
        offerte.setRoofPitch(req.getRoofPitch());
        offerte.setCorniceHeight(req.getCorniceHeight());
        offerte.setRidgeHeight(req.getRidgeHeight());
        offerte.setCeilingHeightKelder(req.getCeilingHeightKelder());
        offerte.setCeilingHeightGelijkvloers(req.getCeilingHeightGelijkvloers());
        offerte.setCeilingHeightVerdiep1(req.getCeilingHeightVerdiep1());
        offerte.setCeilingHeightZolderverdiep(req.getCeilingHeightZolderverdiep());
        offerte.setCltM2(req.getCltM2());
        offerte.setCltPricePerM2(req.getCltPricePerM2());
        offerte.setGlColumnsM3(req.getGlColumnsM3());
        offerte.setGlColumnsPricePerM3(req.getGlColumnsPricePerM3());
        offerte.setGlBeamsM3(req.getGlBeamsM3());
        offerte.setGlBeamsPricePerM3(req.getGlBeamsPricePerM3());
        offerte.setIncludeRoostring(req.getIncludeRoostring());
        offerte.setRoosteringM2(req.getRoosteringM2());
        offerte.setRoosteringPricePerM2(req.getRoosteringPricePerM2());
        offerte.setNumberOfTrucks(req.getNumberOfTrucks());
        offerte.setEngineeringRatePct(req.getEngineeringRatePct());
        offerte.setCncCltRatePerM2(req.getCncCltRatePerM2());
        offerte.setCncGlRatePerM3(req.getCncGlRatePerM3());
        offerte.setAccessoiresRatePct(req.getAccessoiresRatePct());
        offerte.setMontageRatePct(req.getMontageRatePct());
        offerte.setTransportRatePerTruck(req.getTransportRatePerTruck());
        offerte.setEngineeringOverride(req.getEngineeringOverride());
        offerte.setCncCltOverride(req.getCncCltOverride());
        offerte.setCncGlOverride(req.getCncGlOverride());
        offerte.setAccessoiresOverride(req.getAccessoiresOverride());
        offerte.setMontageOverride(req.getMontageOverride());
        offerte.setTransportOverride(req.getTransportOverride());
        offerte.setNotes(req.getNotes());

        offerte.getLineItems().clear();
        if (req.getLineItems() != null) {
            int order = 0;
            for (OfferteLineItemDto dto : req.getLineItems()) {
                OfferteLineItem item = new OfferteLineItem();
                item.setOfferte(offerte);
                item.setDescription(dto.getDescription());
                item.setQuantity(dto.getQuantity());
                item.setUnit(dto.getUnit());
                item.setPricePerUnit(dto.getPricePerUnit());
                item.setSortOrder(dto.getSortOrder() != null ? dto.getSortOrder() : order);
                item.setSection(dto.getSection() != null && dto.getSection().equals("STRUCTUUR")
                        ? OfferteLineItem.LineItemSection.STRUCTUUR : OfferteLineItem.LineItemSection.EXTRA);
                offerte.getLineItems().add(item);
                order++;
            }
        }
        return offerte;
    }

    public OfferteResponse mapToResponse(Offerte o) {
        BigDecimal cltTotal       = safe(o.getCltM2()).multiply(safe(o.getCltPricePerM2()));
        BigDecimal glColumnsTotal = safe(o.getGlColumnsM3()).multiply(safe(o.getGlColumnsPricePerM3()));
        BigDecimal glBeamsTotal   = safe(o.getGlBeamsM3()).multiply(safe(o.getGlBeamsPricePerM3()));
        BigDecimal structuurLineItemsTotal = o.getLineItems().stream()
                .filter(item -> OfferteLineItem.LineItemSection.STRUCTUUR.equals(item.getSection()))
                .map(item -> safe(item.getQuantity()).multiply(safe(item.getPricePerUnit())))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);
        BigDecimal structuurTotal = cltTotal.add(glColumnsTotal).add(glBeamsTotal).add(structuurLineItemsTotal);

        BigDecimal engPct    = o.getEngineeringRatePct()   != null ? o.getEngineeringRatePct()   : DEFAULT_ENGINEERING_PCT;
        BigDecimal accPct    = o.getAccessoiresRatePct()   != null ? o.getAccessoiresRatePct()   : DEFAULT_ACCESSORIES_PCT;
        BigDecimal monPct    = o.getMontageRatePct()        != null ? o.getMontageRatePct()        : DEFAULT_MONTAGE_PCT;
        BigDecimal cncClt    = o.getCncCltRatePerM2()       != null ? o.getCncCltRatePerM2()       : DEFAULT_CNC_CLT_RATE;
        BigDecimal cncGl     = o.getCncGlRatePerM3()        != null ? o.getCncGlRatePerM3()        : DEFAULT_CNC_GL_RATE;
        BigDecimal truckRate = o.getTransportRatePerTruck() != null ? o.getTransportRatePerTruck() : DEFAULT_TRANSPORT_RATE;

        BigDecimal engineeringCost = o.getEngineeringOverride() != null ? o.getEngineeringOverride()
                : structuurTotal.multiply(engPct).divide(HUNDRED, 2, RoundingMode.HALF_UP);
        BigDecimal cncCltCost = o.getCncCltOverride() != null ? o.getCncCltOverride()
                : safe(o.getCltM2()).multiply(cncClt).setScale(2, RoundingMode.HALF_UP);
        BigDecimal cncGlCost = o.getCncGlOverride() != null ? o.getCncGlOverride()
                : safe(o.getGlColumnsM3()).add(safe(o.getGlBeamsM3())).multiply(cncGl).setScale(2, RoundingMode.HALF_UP);
        BigDecimal accessoiresCost = o.getAccessoiresOverride() != null ? o.getAccessoiresOverride()
                : structuurTotal.multiply(accPct).divide(HUNDRED, 2, RoundingMode.HALF_UP);
        BigDecimal roosteringTotal = Boolean.TRUE.equals(o.getIncludeRoostring())
                ? safe(o.getRoosteringM2()).multiply(safe(o.getRoosteringPricePerM2())).setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        BigDecimal transportCost = o.getTransportOverride() != null ? o.getTransportOverride()
                : BigDecimal.valueOf(o.getNumberOfTrucks() != null ? o.getNumberOfTrucks() : 0).multiply(truckRate);
        BigDecimal montageCost = o.getMontageOverride() != null ? o.getMontageOverride()
                : structuurTotal.multiply(monPct).divide(HUNDRED, 2, RoundingMode.HALF_UP);

        BigDecimal lineItemsTotal = o.getLineItems().stream()
                .filter(item -> OfferteLineItem.LineItemSection.EXTRA.equals(item.getSection()))
                .map(item -> safe(item.getQuantity()).multiply(safe(item.getPricePerUnit())))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal subtotal = structuurTotal.add(engineeringCost).add(cncCltCost).add(cncGlCost)
                .add(accessoiresCost).add(roosteringTotal).add(transportCost).add(montageCost)
                .add(lineItemsTotal);
        BigDecimal vat   = subtotal.multiply(DEFAULT_VAT_PCT).divide(HUNDRED, 2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(vat);

        List<OfferteLineItemDto> lineItemDtos = o.getLineItems().stream().map(item -> {
            OfferteLineItemDto dto = new OfferteLineItemDto();
            dto.setId(item.getId());
            dto.setDescription(item.getDescription());
            dto.setQuantity(item.getQuantity());
            dto.setUnit(item.getUnit());
            dto.setPricePerUnit(item.getPricePerUnit());
            dto.setSortOrder(item.getSortOrder());
            dto.setSection(item.getSection() != null ? item.getSection().name() : "EXTRA");
            return dto;
        }).collect(Collectors.toList());

        return OfferteResponse.builder()
                .id(o.getId())
                .offerteNumber(o.getOfferteNumber())
                .date(o.getDate())
                .preparedBy(o.getPreparedBy())
                .projectDescription(o.getProjectDescription())
                .submissionDeadline(o.getSubmissionDeadline())
                .validUntil(o.getValidUntil())
                .deliveryQuarter(o.getDeliveryQuarter())
                .status(o.getStatus().name())
                .clientName(o.getClientName())
                .clientStreet(o.getClientStreet())
                .clientStreetNumber(o.getClientStreetNumber())
                .clientPostcode(o.getClientPostcode())
                .clientCity(o.getClientCity())
                .clientVatNumber(o.getClientVatNumber())
                .siteAddress(o.getSiteAddress())
                .finishGrade(o.getFinishGrade())
                .projectType(o.getProjectType())
                .numberOfUnits(o.getNumberOfUnits())
                .buildingDimensions(o.getBuildingDimensions())
                .numberOfFloors(o.getNumberOfFloors())
                .roofType(o.getRoofType())
                .roofPitch(o.getRoofPitch())
                .corniceHeight(o.getCorniceHeight())
                .ridgeHeight(o.getRidgeHeight())
                .ceilingHeightKelder(o.getCeilingHeightKelder())
                .ceilingHeightGelijkvloers(o.getCeilingHeightGelijkvloers())
                .ceilingHeightVerdiep1(o.getCeilingHeightVerdiep1())
                .ceilingHeightZolderverdiep(o.getCeilingHeightZolderverdiep())
                .cltM2(o.getCltM2())
                .cltPricePerM2(o.getCltPricePerM2())
                .glColumnsM3(o.getGlColumnsM3())
                .glColumnsPricePerM3(o.getGlColumnsPricePerM3())
                .glBeamsM3(o.getGlBeamsM3())
                .glBeamsPricePerM3(o.getGlBeamsPricePerM3())
                .includeRoostring(o.getIncludeRoostring())
                .roosteringM2(o.getRoosteringM2())
                .roosteringPricePerM2(o.getRoosteringPricePerM2())
                .numberOfTrucks(o.getNumberOfTrucks())
                .engineeringRatePct(o.getEngineeringRatePct())
                .cncCltRatePerM2(o.getCncCltRatePerM2())
                .cncGlRatePerM3(o.getCncGlRatePerM3())
                .accessoiresRatePct(o.getAccessoiresRatePct())
                .montageRatePct(o.getMontageRatePct())
                .transportRatePerTruck(o.getTransportRatePerTruck())
                .engineeringOverride(o.getEngineeringOverride())
                .cncCltOverride(o.getCncCltOverride())
                .cncGlOverride(o.getCncGlOverride())
                .accessoiresOverride(o.getAccessoiresOverride())
                .montageOverride(o.getMontageOverride())
                .transportOverride(o.getTransportOverride())
                .lineItems(lineItemDtos)
                .lineItemsTotal(lineItemsTotal)
                .structuurTotal(structuurTotal.setScale(2, RoundingMode.HALF_UP))
                .engineeringCost(engineeringCost)
                .cncCltCost(cncCltCost)
                .cncGlCost(cncGlCost)
                .accessoiresCost(accessoiresCost)
                .roosteringTotal(roosteringTotal)
                .transportCost(transportCost)
                .montageCost(montageCost)
                .subtotalExclVat(subtotal.setScale(2, RoundingMode.HALF_UP))
                .vat(vat)
                .totalInclVat(total.setScale(2, RoundingMode.HALF_UP))
                .notes(o.getNotes())
                .createdByName(o.getCreatedBy() != null ? o.getCreatedBy().getUsername() : null)
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .build();
    }

    private BigDecimal safe(BigDecimal val) {
        return val != null ? val : BigDecimal.ZERO;
    }
}