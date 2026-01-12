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
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private String status; // TO_DO, IN_PROGRESS, DONE
    private String priority; // LOW, MEDIUM, HIGH
    private LocalDate dueDate;
    
    // Drawing set info
    private Long drawingSetId;
    private String drawingSetName;
    
    // Assigned user info
    private Long assignedUserId;
    private String assignedUserName;
    
    // Created by user info
    private Long createdById;
    private String createdByName;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
