package com.bim.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskRequest {
    private String title;
    private String description;
    private String status; // TO_DO, IN_PROGRESS, DONE
    private String priority; // LOW, MEDIUM, HIGH
    private LocalDate dueDate;
    private Long drawingSetId;
    private Long assignedUserId;
}
