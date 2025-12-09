package com.bim.backend.controller;

import com.bim.backend.dto.DrawingFileResponse;
import com.bim.backend.dto.DrawingSetCreateRequest;
import com.bim.backend.dto.DrawingSetResponse;
import com.bim.backend.entity.DrawingFile;
import com.bim.backend.entity.DrawingSet;
import com.bim.backend.entity.Project;
import com.bim.backend.repository.DrawingFileRepository;
import com.bim.backend.repository.DrawingSetRepository;
import com.bim.backend.repository.ProjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class DrawingSetController {

    private final DrawingSetRepository drawingSetRepository;
    private final ProjectRepository projectRepository;
    private final DrawingFileRepository drawingFileRepository;

    public DrawingSetController(DrawingSetRepository drawingSetRepository,
                                ProjectRepository projectRepository,
                                DrawingFileRepository drawingFileRepository) {
        this.drawingSetRepository = drawingSetRepository;
        this.projectRepository = projectRepository;
        this.drawingFileRepository = drawingFileRepository;
    }

    // Create a new drawing set for a project
    @PostMapping("/projects/{projectId}/drawing-sets")
    public ResponseEntity<DrawingSetResponse> createDrawingSet(
            @PathVariable Long projectId,
            @RequestBody DrawingSetCreateRequest request) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        DrawingSet drawingSet = DrawingSet.builder()
                .name(request.getName())
                .description(request.getDescription())
                .revisionNumber(request.getRevisionNumber())
                .project(project)
                .isLatest(false)
                .build();

        DrawingSet savedDrawingSet = drawingSetRepository.save(drawingSet);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponse(savedDrawingSet));
    }

    // Get all drawing sets for a project
    @GetMapping("/projects/{projectId}/drawing-sets")
    public ResponseEntity<List<DrawingSetResponse>> getDrawingSetsByProject(@PathVariable Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        List<DrawingSetResponse> drawingSets = drawingSetRepository.findByProjectOrderByCreatedAtDesc(project)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(drawingSets);
    }

    // Get a specific drawing set by ID
    @GetMapping("/drawing-sets/{id}")
    public ResponseEntity<DrawingSetResponse> getDrawingSetById(@PathVariable Long id) {
        DrawingSet drawingSet = drawingSetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drawing set not found"));

        return ResponseEntity.ok(mapToResponse(drawingSet));
    }

    // Get all files in a drawing set
    @GetMapping("/drawing-sets/{id}/files")
    public ResponseEntity<List<DrawingFileResponse>> getFilesByDrawingSet(@PathVariable Long id) {
        DrawingSet drawingSet = drawingSetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drawing set not found"));

        List<DrawingFileResponse> files = drawingFileRepository.findByDrawingSet(drawingSet)
                .stream()
                .map(this::mapFileToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.ok(files);
    }

    // Delete a drawing set
    @DeleteMapping("/drawing-sets/{id}")
    public ResponseEntity<Void> deleteDrawingSet(@PathVariable Long id) {
        DrawingSet drawingSet = drawingSetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drawing set not found"));

        drawingSetRepository.delete(drawingSet);
        return ResponseEntity.noContent().build();
    }

    // Map DrawingSet entity to response DTO
    private DrawingSetResponse mapToResponse(DrawingSet drawingSet) {
        int fileCount = drawingFileRepository.findByDrawingSet(drawingSet).size();

        return DrawingSetResponse.builder()
                .id(drawingSet.getId())
                .name(drawingSet.getName())
                .description(drawingSet.getDescription())
                .revisionNumber(drawingSet.getRevisionNumber())
                .isLatest(drawingSet.getIsLatest())
                .createdAt(drawingSet.getCreatedAt())
                .updatedAt(drawingSet.getUpdatedAt())
                .projectId(drawingSet.getProject().getId())
                .projectName(drawingSet.getProject().getName())
                .fileCount(fileCount)
                .build();
    }

    // Map DrawingFile entity to response DTO
    private DrawingFileResponse mapFileToResponse(DrawingFile file) {
        return DrawingFileResponse.builder()
                .id(file.getId())
                .originalFileName(file.getOriginalFileName())
                .renamedFileName(file.getRenamedFileName())
                .fileSize(file.getFileSize())
                .createdAt(file.getCreatedAt())
                .build();
    }
}