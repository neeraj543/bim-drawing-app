package com.bim.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeEntryResponse {
    private Long id;
    private Long durationSeconds;
    private String description;
    private LocalDate date;

    private Long userId;
    private String userName;
    private String userFullName;

    private Long projectId;
    private String projectName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
