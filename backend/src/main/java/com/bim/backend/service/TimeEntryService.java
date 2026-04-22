package com.bim.backend.service;

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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TimeEntryService {

    @Autowired private TimeEntryRepository timeEntryRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private ProjectRepository projectRepository;

    public List<TimeEntryResponse> getTimeEntries() {
        User currentUser = getCurrentUser();
        List<TimeEntry> entries = currentUser.getRole() == User.Role.ADMIN
                ? timeEntryRepository.findAllByOrderByDateDescCreatedAtDesc()
                : timeEntryRepository.findByUserOrderByDateDescCreatedAtDesc(currentUser);
        return entries.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public TimeEntryResponse createTimeEntry(CreateTimeEntryRequest request) {
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

        return mapToResponse(timeEntryRepository.save(entry));
    }

    public TimeEntryResponse updateTimeEntry(Long id, UpdateTimeEntryRequest request) {
        User currentUser = getCurrentUser();
        TimeEntry entry = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Time entry not found with id: " + id));

        if (currentUser.getRole() != User.Role.ADMIN && !entry.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        if (request.getDurationSeconds() != null) entry.setDurationSeconds(request.getDurationSeconds());
        if (request.getDescription() != null) entry.setDescription(request.getDescription());
        if (request.getDate() != null) entry.setDate(request.getDate());
        if (request.getProjectId() != null) {
            Project project = projectRepository.findById(request.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));
            entry.setProject(project);
        } else {
            entry.setProject(null);
        }

        return mapToResponse(timeEntryRepository.save(entry));
    }

    public void deleteTimeEntry(Long id) {
        User currentUser = getCurrentUser();
        TimeEntry entry = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Time entry not found with id: " + id));

        if (currentUser.getRole() != User.Role.ADMIN && !entry.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }

        timeEntryRepository.delete(entry);
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
