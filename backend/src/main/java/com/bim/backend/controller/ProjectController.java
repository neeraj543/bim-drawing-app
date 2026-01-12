package com.bim.backend.controller;

import com.bim.backend.dto.ProjectCreateRequest;
import com.bim.backend.dto.ProjectResponse;
import com.bim.backend.entity.Project;
import com.bim.backend.entity.User;
import com.bim.backend.repository.ProjectRepository;
import com.bim.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectController {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectController(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    // Get all projects
    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getAllProjects() {
        User systemUser = userRepository.findByUsername("system")
                .orElseThrow(() -> new RuntimeException("System user not found"));

        List<ProjectResponse> projects = projectRepository.findByOwner(systemUser)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(projects);
    }

    // Get a single project by ID
    @GetMapping("/{id}")
    public ResponseEntity<ProjectResponse> getProjectById(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return ResponseEntity.ok(mapToResponse(project));
    }

    // Create a new project
    // Request body is the data from the backend and reponse body is the backend to frontend
    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(@RequestBody ProjectCreateRequest request) {
        User systemUser = userRepository.findByUsername("system")
                .orElseThrow(() -> new RuntimeException("System user not found"));

        Project project = Project.builder()
                .name(request.getName())
                .projectNumber(request.getProjectNumber())
                .projectName(request.getProjectName())
                .description(request.getDescription())
                .owner(systemUser)
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
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setName(request.getName());
        project.setProjectNumber(request.getProjectNumber());
        project.setProjectName(request.getProjectName());
        project.setDescription(request.getDescription());

        Project updatedProject = projectRepository.save(project);
        return ResponseEntity.ok(mapToResponse(updatedProject));
    }

    // Delete a project
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

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