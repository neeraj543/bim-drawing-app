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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class DrawingSetController {

    private final DrawingSetRepository drawingSetRepository;
    private final ProjectRepository projectRepository;
    private final DrawingFileRepository drawingFileRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

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

    // Upload files to a drawing set with auto-rename
    @PostMapping("/drawing-sets/{setId}/upload")
    public ResponseEntity<List<DrawingFileResponse>> uploadFiles(
            @PathVariable Long setId,
            @RequestParam("files") MultipartFile[] files,
            @RequestParam(value = "descriptions", required = false) String[] descriptions) throws IOException {

        DrawingSet drawingSet = drawingSetRepository.findById(setId)
                .orElseThrow(() -> new RuntimeException("Drawing set not found"));

        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir, "project-" + drawingSet.getProject().getId(), "set-" + setId);
        Files.createDirectories(uploadPath);

        List<DrawingFile> uploadedFiles = new ArrayList<>();

        for (int i = 0; i < files.length; i++) {
            MultipartFile file = files[i];
            String originalFileName = file.getOriginalFilename();

            // Extract sheet number from filename (e.g., "Sheet_A101.pdf" -> "A101")
            String sheetNumber = extractSheetNumber(originalFileName);

            // Get description (use index if provided, otherwise use empty string)
            String description = (descriptions != null && i < descriptions.length)
                ? descriptions[i]
                : "";

            // Generate renamed filename: A101_Floor-Plan_RevA_2025-12-09.pdf
            String renamedFileName = generateRenamedFileName(
                sheetNumber,
                description,
                drawingSet.getRevisionNumber()
            );

            // Save file to disk
            Path filePath = uploadPath.resolve(renamedFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Create DrawingFile record
            DrawingFile drawingFile = DrawingFile.builder()
                    .drawingSet(drawingSet)
                    .originalFileName(originalFileName)
                    .renamedFileName(renamedFileName)
                    .filePath(filePath.toString())
                    .fileSize(file.getSize())
                    .build();

            uploadedFiles.add(drawingFileRepository.save(drawingFile));
        }

        List<DrawingFileResponse> responses = uploadedFiles.stream()
                .map(this::mapFileToResponse)
                .collect(Collectors.toList());

        return ResponseEntity.status(HttpStatus.CREATED).body(responses);
    }

    // Delete a drawing set
    @DeleteMapping("/drawing-sets/{id}")
    public ResponseEntity<Void> deleteDrawingSet(@PathVariable Long id) {
        DrawingSet drawingSet = drawingSetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Drawing set not found"));

        drawingSetRepository.delete(drawingSet);
        return ResponseEntity.noContent().build();
    }

    // Extract sheet number from filename (e.g., "Sheet_A101.pdf" -> "A101")
    private String extractSheetNumber(String filename) {
        Pattern pattern = Pattern.compile("Sheet[_-]?([A-Za-z0-9]+)", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(filename);

        if (matcher.find()) {
            return matcher.group(1);
        }

        // If no "Sheet_" prefix, try to extract alphanumeric before extension
        String nameWithoutExt = filename.replaceFirst("[.][^.]+$", "");
        return nameWithoutExt.replaceAll("[^A-Za-z0-9]", "");
    }

    // Generate renamed filename: A101_Floor-Plan_RevA_2025-12-09.pdf
    private String generateRenamedFileName(String sheetNumber, String description, String revisionNumber) {
        String date = LocalDate.now().toString();

        // Clean description (remove special characters, replace spaces with hyphens)
        String cleanDescription = description.trim()
                .replaceAll("[^A-Za-z0-9\\s-]", "")
                .replaceAll("\\s+", "-");

        // Build filename
        StringBuilder filename = new StringBuilder(sheetNumber);

        if (!cleanDescription.isEmpty()) {
            filename.append("_").append(cleanDescription);
        }

        if (revisionNumber != null && !revisionNumber.isEmpty()) {
            filename.append("_").append(revisionNumber);
        }

        filename.append("_").append(date).append(".pdf");

        return filename.toString();
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