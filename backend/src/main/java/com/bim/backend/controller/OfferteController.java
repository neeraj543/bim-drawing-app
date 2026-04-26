package com.bim.backend.controller;

import com.bim.backend.dto.OfferteRequest;
import com.bim.backend.dto.OfferteResponse;
import com.bim.backend.service.OfferteService;
import com.bim.backend.service.OffertePdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/offertes")
public class OfferteController {

    @Autowired
    private OfferteService offerteService;

    @Autowired
    private OffertePdfService offertePdfService;

    @GetMapping
    public ResponseEntity<List<OfferteResponse>> getAllOffertes(@RequestParam(required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(offerteService.getOffertesByStatus(status));
        }
        return ResponseEntity.ok(offerteService.getAllOffertes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OfferteResponse> getOfferte(@PathVariable Long id) {
        return ResponseEntity.ok(offerteService.getOfferte(id));
    }

    @PostMapping
    public ResponseEntity<OfferteResponse> createOfferte(@RequestBody OfferteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(offerteService.createOfferte(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OfferteResponse> updateOfferte(@PathVariable Long id, @RequestBody OfferteRequest request) {
        return ResponseEntity.ok(offerteService.updateOfferte(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OfferteResponse> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(offerteService.updateStatus(id, status));
    }

    @PostMapping("/{id}/duplicate")
    public ResponseEntity<OfferteResponse> duplicateOfferte(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.CREATED).body(offerteService.duplicateOfferte(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOfferte(@PathVariable Long id) {
        offerteService.deleteOfferte(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) throws Exception {
        OfferteResponse offerte = offerteService.getOfferte(id);
        byte[] pdf = offertePdfService.generate(offerte);
        String filename = "offerte-" + offerte.getOfferteNumber().replace("/", "-") + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
