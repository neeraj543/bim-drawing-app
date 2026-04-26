package com.bim.backend.service;

import com.bim.backend.dto.OfferteRequest;
import com.bim.backend.dto.OfferteResponse;
import com.bim.backend.entity.Offerte;
import com.bim.backend.entity.User;
import com.bim.backend.exception.ResourceNotFoundException;
import com.bim.backend.repository.OfferteRepository;
import com.bim.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OfferteService {

    private static final BigDecimal CNC_CLT_RATE = new BigDecimal("11.00");   // â‚¬8 + 12% markup
    private static final BigDecimal CNC_GL_RATE = new BigDecimal("260.00");
    private static final BigDecimal TRANSPORT_RATE = new BigDecimal("2250.00");
    private static final BigDecimal ENGINEERING_RATE = new BigDecimal("0.05");
    private static final BigDecimal ACCESSORIES_RATE = new BigDecimal("0.12");
    private static final BigDecimal MONTAGE_RATE = new BigDecimal("0.22");
    private static final BigDecimal VAT_RATE = new BigDecimal("0.21");

    @Autowired private OfferteRepository offerteRepository;
    @Autowired private UserRepository userRepository;

    public List<OfferteResponse> getAllOffertes() {
        return offerteRepository.findAllByOrderByDateDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<OfferteResponse> getOffertesByStatus(String status) {
        return offerteRepository.findByStatusOrderByDateDesc(Offerte.OfferteStatus.valueOf(status))
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public OfferteResponse getOfferte(Long id) {
        return mapToResponse(offerteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offerte not found with id: " + id)));
    }

    public OfferteResponse createOfferte(OfferteRequest request) {
        if (offerteRepository.existsByOfferteNumber(request.getOfferteNumber())) {
            throw new IllegalArgumentException("Offerte number already exists: " + request.getOfferteNumber());
        }

        User currentUser = getCurrentUser();
        Offerte offerte = buildOfferte(new Offerte(), request);
        offerte.setCreatedBy(currentUser);

        return mapToResponse(offerteRepository.save(offerte));
    }

    public OfferteResponse updateOfferte(Long id, OfferteRequest request) {
        Offerte offerte = offerteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offerte not found with id: " + id));

        buildOfferte(offerte, request);
        return mapToResponse(offerteRepository.save(offerte));
    }

    public OfferteResponse updateStatus(Long id, String status) {
        Offerte offerte = offerteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offerte not found with id: " + id));
        offerte.setStatus(Offerte.OfferteStatus.valueOf(status));
        return mapToResponse(offerteRepository.save(offerte));
    }

    public OfferteResponse duplicateOfferte(Long id) {
        Offerte original = offerteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offerte not found with id: " + id));

        Offerte copy = Offerte.builder()
                .offerteNumber(original.getOfferteNumber() + "-COPY")
                .date(LocalDate.now())
                .preparedBy(original.getPreparedBy())
                .projectDescription(original.getProjectDescription())
                .submissionDeadline(original.getSubmissionDeadline())
                .status(Offerte.OfferteStatus.DRAFT)
                .clientName(original.getClientName())
                .clientStreet(original.getClientStreet())
                .clientStreetNumber(original.getClientStreetNumber())
                .clientPostcode(original.getClientPostcode())
                .clientCity(original.getClientCity())
                .clientVatNumber(original.getClientVatNumber())
                .siteAddress(original.getSiteAddress())
                .finishGrade(original.getFinishGrade())
                .projectType(original.getProjectType())
                .numberOfUnits(original.getNumberOfUnits())
                .buildingDimensions(original.getBuildingDimensions())
                .numberOfFloors(original.getNumberOfFloors())
                .roofType(original.getRoofType())
                .roofPitch(original.getRoofPitch())
                .corniceHeight(original.getCorniceHeight())
                .ridgeHeight(original.getRidgeHeight())
                .ceilingHeightKelder(original.getCeilingHeightKelder())
                .ceilingHeightGelijkvloers(original.getCeilingHeightGelijkvloers())
                .ceilingHeightVerdiep1(original.getCeilingHeightVerdiep1())
                .ceilingHeightZolderverdiep(original.getCeilingHeightZolderverdiep())
                .cltM2(original.getCltM2())
                .cltPricePerM2(original.getCltPricePerM2())
                .glColumnsM3(original.getGlColumnsM3())
                .glColumnsPricePerM3(original.getGlColumnsPricePerM3())
                .glBeamsM3(original.getGlBeamsM3())
                .glBeamsPricePerM3(original.getGlBeamsPricePerM3())
                .includeRoostring(original.getIncludeRoostring())
                .roosteringM2(original.getRoosteringM2())
                .roosteringPricePerM2(original.getRoosteringPricePerM2())
                .numberOfTrucks(original.getNumberOfTrucks())
                .engineeringOverride(original.getEngineeringOverride())
                .cncCltOverride(original.getCncCltOverride())
                .cncGlOverride(original.getCncGlOverride())
                .accessoiresOverride(original.getAccessoiresOverride())
                .montageOverride(original.getMontageOverride())
                .transportOverride(original.getTransportOverride())
                .notes(original.getNotes())
                .createdBy(getCurrentUser())
                .build();

        return mapToResponse(offerteRepository.save(copy));
    }

    public void deleteOfferte(Long id) {
        Offerte offerte = offerteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offerte not found with id: " + id));
        offerteRepository.delete(offerte);
    }

    private Offerte buildOfferte(Offerte offerte, OfferteRequest req) {
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
        offerte.setEngineeringOverride(req.getEngineeringOverride());
        offerte.setCncCltOverride(req.getCncCltOverride());
        offerte.setCncGlOverride(req.getCncGlOverride());
        offerte.setAccessoiresOverride(req.getAccessoiresOverride());
        offerte.setMontageOverride(req.getMontageOverride());
        offerte.setTransportOverride(req.getTransportOverride());
        offerte.setNotes(req.getNotes());
        return offerte;
    }

    private OfferteResponse mapToResponse(Offerte o) {
        BigDecimal zero = BigDecimal.ZERO;

        BigDecimal cltTotal = safe(o.getCltM2()).multiply(safe(o.getCltPricePerM2()));
        BigDecimal glColumnsTotal = safe(o.getGlColumnsM3()).multiply(safe(o.getGlColumnsPricePerM3()));
        BigDecimal glBeamsTotal = safe(o.getGlBeamsM3()).multiply(safe(o.getGlBeamsPricePerM3()));
        BigDecimal structuurTotal = cltTotal.add(glColumnsTotal).add(glBeamsTotal);

        BigDecimal engineeringCost = o.getEngineeringOverride() != null ? o.getEngineeringOverride()
                : structuurTotal.multiply(ENGINEERING_RATE).setScale(2, RoundingMode.HALF_UP);

        BigDecimal cncCltCost = o.getCncCltOverride() != null ? o.getCncCltOverride()
                : safe(o.getCltM2()).multiply(CNC_CLT_RATE).setScale(2, RoundingMode.HALF_UP);

        BigDecimal cncGlCost = o.getCncGlOverride() != null ? o.getCncGlOverride()
                : safe(o.getGlColumnsM3()).add(safe(o.getGlBeamsM3())).multiply(CNC_GL_RATE).setScale(2, RoundingMode.HALF_UP);

        BigDecimal accessoiresCost = o.getAccessoiresOverride() != null ? o.getAccessoiresOverride()
                : structuurTotal.multiply(ACCESSORIES_RATE).setScale(2, RoundingMode.HALF_UP);

        BigDecimal roosteringTotal = Boolean.TRUE.equals(o.getIncludeRoostring())
                ? safe(o.getRoosteringM2()).multiply(safe(o.getRoosteringPricePerM2())).setScale(2, RoundingMode.HALF_UP)
                : zero;

        BigDecimal transportCost = o.getTransportOverride() != null ? o.getTransportOverride()
                : BigDecimal.valueOf(o.getNumberOfTrucks() != null ? o.getNumberOfTrucks() : 0).multiply(TRANSPORT_RATE);

        BigDecimal montageCost = o.getMontageOverride() != null ? o.getMontageOverride()
                : structuurTotal.multiply(MONTAGE_RATE).setScale(2, RoundingMode.HALF_UP);

        BigDecimal subtotal = structuurTotal.add(engineeringCost).add(cncCltCost).add(cncGlCost)
                .add(accessoiresCost).add(roosteringTotal).add(transportCost).add(montageCost);

        BigDecimal vat = subtotal.multiply(VAT_RATE).setScale(2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(vat);

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
                .engineeringOverride(o.getEngineeringOverride())
                .cncCltOverride(o.getCncCltOverride())
                .cncGlOverride(o.getCncGlOverride())
                .accessoiresOverride(o.getAccessoiresOverride())
                .montageOverride(o.getMontageOverride())
                .transportOverride(o.getTransportOverride())
                .notes(o.getNotes())
                .createdByName(o.getCreatedBy() != null ? o.getCreatedBy().getUsername() : null)
                .createdAt(o.getCreatedAt())
                .updatedAt(o.getUpdatedAt())
                .build();
    }

    private BigDecimal safe(BigDecimal val) {
        return val != null ? val : BigDecimal.ZERO;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
