package com.bim.backend.controller;

import com.bim.backend.dto.CreateTimeEntryRequest;
import com.bim.backend.dto.TimeEntryResponse;
import com.bim.backend.dto.UpdateTimeEntryRequest;
import com.bim.backend.entity.Project;
import com.bim.backend.entity.TimeEntry;
import com.bim.backend.entity.User;
import com.bim.backend.exception.ResourceNotFoundException;
import com.bim.backend.repository.ProjectRepository;
import com.bim.backend.repository.TimeEntryRepository;
import com.bim.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/time-entries")
public class TimeEntryController {

    private final TimeEntryRepository timeEntryRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public TimeEntryController(TimeEntryRepository timeEntryRepository,
                               UserRepository userRepository,
                               ProjectRepository projectRepository) {
        this.timeEntryRepository = timeEntryRepository;
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
    }

    // Get entries: admin sees all, users see their own
    @GetMapping
    public ResponseEntity<List<TimeEntryResponse>> getTimeEntries() {
        User currentUser = getCurrentUser();

        List<TimeEntry> entries;
        if (currentUser.getRole() == User.Role.ADMIN) {
            entries = timeEntryRepository.findAllByOrderByDateDescCreatedAtDesc();
        } else {
            entries = timeEntryRepository.findByUserOrderByDateDescCreatedAtDesc(currentUser);
        }

        return ResponseEntity.ok(entries.stream().map(this::mapToResponse).collect(Collectors.toList()));
    }

    // Create a new time entry (logged for the current user)
    @PostMapping
    public ResponseEntity<TimeEntryResponse> createTimeEntry(@RequestBody CreateTimeEntryRequest request) {
        User currentUser = getCurrentUser();

        Project project = null;
        if (request.getProjectId() != null) {
            project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));
        }

        TimeEntry entry = TimeEntry.builder()
                .user(currentUser)
                .project(project)
                .description(request.getDescription())
                .durationSeconds(request.getDurationSeconds())
                .date(request.getDate() != null ? request.getDate() : LocalDate.now())
                .build();

        TimeEntry saved = timeEntryRepository.save(entry);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(saved));
    }

    // Update a time entry (own entries only; admin can update any)
    @PutMapping("/{id}")
    public ResponseEntity<TimeEntryResponse> updateTimeEntry(@PathVariable Long id,
                                                              @RequestBody UpdateTimeEntryRequest request) {
        User currentUser = getCurrentUser();

        TimeEntry entry = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Time entry not found with id: " + id));

        if (currentUser.getRole() != User.Role.ADMIN && !entry.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (request.getDurationSeconds() != null) {
            entry.setDurationSeconds(request.getDurationSeconds());
        }
        if (request.getDescription() != null) {
            entry.setDescription(request.getDescription());
        }
        if (request.getDate() != null) {
            entry.setDate(request.getDate());
        }
        // Update project (allows clearing by passing null)
        if (request.getProjectId() != null) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));
            entry.setProject(project);
        } else {
            entry.setProject(null);
        }

        return ResponseEntity.ok(mapToResponse(timeEntryRepository.save(entry)));
    }

    // Delete a time entry (own entries only; admin can delete any)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimeEntry(@PathVariable Long id) {
        User currentUser = getCurrentUser();

        TimeEntry entry = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Time entry not found with id: " + id));

        if (currentUser.getRole() != User.Role.ADMIN && !entry.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        timeEntryRepository.delete(entry);
        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private TimeEntryResponse mapToResponse(TimeEntry entry) {
        return TimeEntryResponse.builder()
                .id(entry.getId())
                .durationSeconds(entry.getDurationSeconds())
                .description(entry.getDescription())
                .date(entry.getDate())
                .userId(entry.getUser().getId())
                .userName(entry.getUser().getUsername())
                .userFullName(entry.getUser().getFullName())
                .projectId(entry.getProject() != null ? entry.getProject().getId() : null)
                .projectName(entry.getProject() != null ? entry.getProject().getName() : null)
                .createdAt(entry.getCreatedAt())
                .updatedAt(entry.getUpdatedAt())
                .build();
    }
}
