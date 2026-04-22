package com.bim.backend.service;

import com.bim.backend.dto.ProjectCreateRequest;
import com.bim.backend.dto.ProjectResponse;
import com.bim.backend.entity.Project;
import com.bim.backend.entity.User;
import com.bim.backend.exception.ResourceNotFoundException;
import com.bim.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired private ProjectRepository projectRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private TimeEntryRepository timeEntryRepository;
    @Autowired private DrawingSetRepository drawingSetRepository;
    @Autowired private DrawingFileRepository drawingFileRepository;
    @Autowired private TaskRepository taskRepository;

    public List<ProjectResponse> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::mapToResponse).collect(Collectors.toList());
    }

    public ProjectResponse getProjectById(Long id) {
        return mapToResponse(projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id)));
    }

    public ProjectResponse createProject(ProjectCreateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));

        Project project = Project.builder()
                .name(request.getName())
                .projectNumber(request.getProjectNumber())
                .projectName(request.getProjectName())
                .description(request.getDescription())
                .owner(currentUser)
                .build();

        return mapToResponse(projectRepository.save(project));
    }

    public ProjectResponse updateProject(Long id, ProjectCreateRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        project.setName(request.getName());
        project.setProjectNumber(request.getProjectNumber());
        project.setProjectName(request.getProjectName());
        project.setDescription(request.getDescription());

        return mapToResponse(projectRepository.save(project));
    }

    @Transactional
    public void deleteProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        timeEntryRepository.clearProjectFromTimeEntries(project);
        taskRepository.deleteAllByProject(project);
        drawingFileRepository.deleteAllByProject(project);
        drawingSetRepository.deleteAllByProject(project);
        projectRepository.deleteById(project.getId());
    }

    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .projectNumber(project.getProjectNumber())
                .projectName(project.getProjectName())
                .description(project.getDescription())
                .ownerName(project.getOwner().getUsername())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
