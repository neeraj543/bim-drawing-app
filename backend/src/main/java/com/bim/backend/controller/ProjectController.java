package com.bim.backend.controller;

import com.bim.backend.dto.ProjectCreateRequest;
import com.bim.backend.dto.ProjectResponse;
import com.bim.backend.entity.Project;
import com.bim.backend.entity.User;
import com.bim.backend.exception.ResourceNotFoundException;
import com.bim.backend.repository.DrawingFileRepository;
import com.bim.backend.repository.DrawingSetRepository;
import com.bim.backend.repository.ProjectRepository;
import com.bim.backend.repository.TaskRepository;
import com.bim.backend.repository.TimeEntryRepository;
import com.bim.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final TimeEntryRepository timeEntryRepository;
    private final DrawingSetRepository drawingSetRepository;
    private final DrawingFileRepository drawingFileRepository;
    private final TaskRepository taskRepository;

    public ProjectController(ProjectRepository projectRepository, UserRepository userRepository,
            TimeEntryRepository timeEntryRepository, DrawingSetRepository drawingSetRepository,
            DrawingFileRepository drawingFileRepository, TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.timeEntryRepository = timeEntryRepository;
        this.drawingSetRepository = drawingSetRepository;
        this.drawingFileRepository = drawingFileRepository;
        this.taskRepository = taskRepository;
    }

    // Get all projects (all users can see all projects)
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        List<ProjectResponse> projects = projectRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(projects);
    }

    // Get a single project by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        return ResponseEntity.ok(mapToResponse(project));
    }

    // Create a new project
    // Request body is the data from the backend and reponse body is the backend to frontend
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody ProjectCreateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Project project = Project.builder()
                .name(request.getName())
                .projectNumber(request.getProjectNumber())
                .projectName(request.getProjectName())
                .description(request.getDescription())
                .owner(currentUser)
                .build();

        Project savedProject = projectRepository.save(project);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(savedProject));
    }

    // Update a project
    @PutMapping("/{id}")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @RequestBody ProjectCreateRequest request) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        project.setName(request.getName());
        project.setProjectNumber(request.getProjectNumber());
        project.setProjectName(request.getProjectName());
        project.setDescription(request.getDescription());

        Project updatedProject = projectRepository.save(project);
        return ResponseEntity.ok(mapToResponse(updatedProject));
    }

    // Delete a project
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        // 1. Unlink time entries (keep them, just remove the project reference)
        timeEntryRepository.clearProjectFromTimeEntries(project);

        // 2. Manually delete drawing sets and their children (tasks + files)
        List<com.bim.backend.entity.DrawingSet> drawingSets = new ArrayList<>(drawingSetRepository.findByProject(project));
        for (com.bim.backend.entity.DrawingSet drawingSet : drawingSets) {
            taskRepository.deleteAll(taskRepository.findByDrawingSet(drawingSet));
            drawingFileRepository.deleteAll(drawingFileRepository.findByDrawingSet(drawingSet));
            drawingSetRepository.delete(drawingSet);
        }

        // 3. Delete the project
        projectRepository.delete(project);

        return ResponseEntity.noContent().build();
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