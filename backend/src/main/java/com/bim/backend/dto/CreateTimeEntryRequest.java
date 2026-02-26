package com.bim.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateTimeEntryRequest {
    private Long durationSeconds;
    private String description;
    private LocalDate date;
    private Long projectId; // optional
}
