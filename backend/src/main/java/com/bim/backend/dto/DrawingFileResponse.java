package com.bim.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrawingFileResponse {
    private Long id;
    private String originalFileName;
    private String renamedFileName;
    private Long fileSize;
    private LocalDateTime createdAt;
}