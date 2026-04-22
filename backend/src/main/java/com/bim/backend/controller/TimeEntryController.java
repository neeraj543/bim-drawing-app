package com.bim.backend.controller;

import com.bim.backend.dto.CreateTimeEntryRequest;
import com.bim.backend.dto.TimeEntryResponse;
import com.bim.backend.dto.UpdateTimeEntryRequest;
import com.bim.backend.service.TimeEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/time-entries")
public class TimeEntryController {

    @Autowired
    private TimeEntryService timeEntryService;

    @GetMapping
    public ResponseEntity<List<TimeEntryResponse>> getTimeEntries() {
        return ResponseEntity.ok(timeEntryService.getTimeEntries());
    }

    @PostMapping
    public ResponseEntity<TimeEntryResponse> createTimeEntry(@RequestBody CreateTimeEntryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(timeEntryService.createTimeEntry(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeEntryResponse> updateTimeEntry(@PathVariable Long id, @RequestBody UpdateTimeEntryRequest request) {
        return ResponseEntity.ok(timeEntryService.updateTimeEntry(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimeEntry(@PathVariable Long id) {
        timeEntryService.deleteTimeEntry(id);
        return ResponseEntity.noContent().build();
    }
}
