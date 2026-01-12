package com.bim.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectCreateRequest {
    private String name; // User-defined project name
    private String projectNumber; // e.g., "2025001"
    private String projectName; // e.g., "Wiekevorst"
    private String description;
}