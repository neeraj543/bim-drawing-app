package com.bim.backend.service;

import com.bim.backend.dto.OfferteRequest;
import com.bim.backend.dto.OfferteResponse;
import com.bim.backend.entity.Offerte;
import com.bim.backend.entity.OfferteLineItem;
import com.bim.backend.entity.User;
import com.bim.backend.exception.ResourceNotFoundException;
import com.bim.backend.repository.OfferteRepository;
import com.bim.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OfferteService {

    @Autowired private OfferteRepository offerteRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private OfferteMapper offerteMapper;

    public List<OfferteResponse> getAllOffertes() {
        return offerteRepository.findAllByOrderByDateDesc()
                .stream().map(offerteMapper::mapToResponse).collect(Collectors.toList());
    }

    public List<OfferteResponse> getOffertesByStatus(String status) {
        return offerteRepository.findByStatusOrderByDateDesc(Offerte.OfferteStatus.valueOf(status))
                .stream().map(offerteMapper::mapToResponse).collect(Collectors.toList());
    }

    public OfferteResponse getOfferte(Long id) {
        return offerteMapper.mapToResponse(offerteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offerte not found with id: " + id)));
    }

    public OfferteResponse createOfferte(OfferteRequest request) {
        User currentUser = getCurrentUser();
        Offerte offerte = offerteMapper.buildOfferte(new Offerte(), request);

        if (offerte.getOfferteNumber() == null || offerte.getOfferteNumber().isBlank()) {
            offerte.setOfferteNumber(generateNextOfferteNumber());
        } else if (offerteRepository.existsByOfferteNumber(offerte.getOfferteNumber())) {
            throw new IllegalArgumentException("Offerte number already exists: " + offerte.getOfferteNumber());
        }

        offerte.setCreatedBy(currentUser);
        return offerteMapper.mapToResponse(offerteRepository.save(offerte));
    }

    public OfferteResponse updateOfferte(Long id, OfferteRequest request) {
        Offerte offerte = offerteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offerte not found with id: " + id));
        offerteMapper.buildOfferte(offerte, request);
        return offerteMapper.mapToResponse(offerteRepository.save(offerte));
    }

    public OfferteResponse updateStatus(Long id, String status) {
        Offerte offerte = offerteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offerte not found with id: " + id));
        offerte.setStatus(Offerte.OfferteStatus.valueOf(status));
        return offerteMapper.mapToResponse(offerteRepository.save(offerte));
    }

    public OfferteResponse duplicateOfferte(Long id) {
        Offerte original = offerteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offerte not found with id: " + id));

        Offerte copy = Offerte.builder()
                .offerteNumber(generateNextOfferteNumber())
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
                .engineeringRatePct(original.getEngineeringRatePct())
                .cncCltRatePerM2(original.getCncCltRatePerM2())
                .cncGlRatePerM3(original.getCncGlRatePerM3())
                .accessoiresRatePct(original.getAccessoiresRatePct())
                .montageRatePct(original.getMontageRatePct())
                .transportRatePerTruck(original.getTransportRatePerTruck())
                .engineeringOverride(original.getEngineeringOverride())
                .cncCltOverride(original.getCncCltOverride())
                .cncGlOverride(original.getCncGlOverride())
                .accessoiresOverride(original.getAccessoiresOverride())
                .montageOverride(original.getMontageOverride())
                .transportOverride(original.getTransportOverride())
                .notes(original.getNotes())
                .createdBy(getCurrentUser())
                .build();

        Offerte savedCopy = offerteRepository.save(copy);

        for (OfferteLineItem item : original.getLineItems()) {
            OfferteLineItem copyItem = OfferteLineItem.builder()
                    .offerte(savedCopy)
                    .description(item.getDescription())
                    .quantity(item.getQuantity())
                    .unit(item.getUnit())
                    .pricePerUnit(item.getPricePerUnit())
                    .sortOrder(item.getSortOrder())
                    .build();
            savedCopy.getLineItems().add(copyItem);
        }

        return offerteMapper.mapToResponse(offerteRepository.save(savedCopy));
    }

    public void deleteOfferte(Long id) {
        Offerte offerte = offerteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Offerte not found with id: " + id));
        offerteRepository.delete(offerte);
    }

    private String generateNextOfferteNumber() {
        String yearPrefix = String.valueOf(LocalDate.now().getYear()).substring(2);
        List<String> existing = offerteRepository.findOfferteNumbersByYearPrefix(yearPrefix);
        int nextSeq = 1;
        for (String num : existing) {
            try {
                int seq = Integer.parseInt(num.substring(yearPrefix.length()));
                if (seq >= nextSeq) nextSeq = seq + 1;
            } catch (NumberFormatException ignored) {}
        }
        return String.format("%s%03d", yearPrefix, nextSeq);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}