package com.bim.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DrawingSetCreateRequest {
    private String name;
    private String description;
    private String revisionNumber;
    private Long projectId;
}