package com.bim.backend.service;

import com.bim.backend.dto.DrawingFileResponse;
import com.bim.backend.dto.DrawingSetCreateRequest;
import com.bim.backend.dto.DrawingSetResponse;
import com.bim.backend.entity.DrawingFile;
import com.bim.backend.entity.DrawingSet;
import com.bim.backend.entity.Project;
import com.bim.backend.exception.ResourceNotFoundException;
import com.bim.backend.repository.DrawingFileRepository;
import com.bim.backend.repository.DrawingSetRepository;
import com.bim.backend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class DrawingSetService {

    @Autowired private DrawingSetRepository drawingSetRepository;
    @Autowired private ProjectRepository projectRepository;
    @Autowired private DrawingFileRepository drawingFileRepository;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public DrawingSetResponse createDrawingSet(Long projectId, DrawingSetCreateRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        drawingSetRepository.findByProjectOrderByCreatedAtDesc(project).forEach(set -> {
            set.setIsLatest(false);
            drawingSetRepository.save(set);
        });

        DrawingSet drawingSet = DrawingSet.builder()
                .name(request.getName())
                .description(request.getDescription())
                .revisionNumber(request.getRevisionNumber())
                .project(project)
                .isLatest(true)
                .build();

        return mapToResponse(drawingSetRepository.save(drawingSet));
    }

    public List<DrawingSetResponse> getDrawingSetsByProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        return drawingSetRepository.findByProjectOrderByCreatedAtDesc(project)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public DrawingSetResponse getDrawingSetById(Long id) {
        return mapToResponse(drawingSetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drawing set not found with id: " + id)));
    }

    public List<DrawingFileResponse> getFilesByDrawingSet(Long id) {
        DrawingSet drawingSet = drawingSetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drawing set not found with id: " + id));

        return drawingFileRepository.findByDrawingSet(drawingSet)
                .stream().map(this::mapFileToResponse).collect(Collectors.toList());
    }

    public List<DrawingFileResponse> uploadFiles(Long setId, MultipartFile[] files, String[] floors, String[] designerInitials) throws IOException {
        DrawingSet drawingSet = drawingSetRepository.findById(setId)
                .orElseThrow(() -> new ResourceNotFoundException("Drawing set not found with id: " + setId));

        if (floors.length != files.length || designerInitials.length != files.length) {
            throw new IllegalArgumentException("Floors and designer initials arrays must match files array length");
        }

        Path uploadPath = Paths.get(uploadDir, "project-" + drawingSet.getProject().getId(), "set-" + setId);
        Files.createDirectories(uploadPath);

        List<DrawingFile> uploadedFiles = new ArrayList<>();

        for (int i = 0; i < files.length; i++) {
            MultipartFile file = files[i];
            String originalFileName = file.getOriginalFilename();

            if (floors[i] == null || floors[i].trim().isEmpty()) {
                throw new IllegalArgumentException("Floor is required for file: " + originalFileName);
            }
            if (designerInitials[i] == null || designerInitials[i].trim().isEmpty()) {
                throw new IllegalArgumentException("Designer initials are required for file: " + originalFileName);
            }

            String extension = (originalFileName != null && originalFileName.contains("."))
                    ? originalFileName.substring(originalFileName.lastIndexOf(".")) : "";
            String storedFileName = UUID.randomUUID().toString() + extension;

            Path filePath = uploadPath.resolve(storedFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            DrawingFile drawingFile = DrawingFile.builder()
                    .drawingSet(drawingSet)
                    .originalFileName(originalFileName)
                    .storedFileName(storedFileName)
                    .filePath(filePath.toString())
                    .fileSize(file.getSize())
                    .floor(floors[i].trim())
                    .designerInitials(designerInitials[i].trim())
                    .build();

            uploadedFiles.add(drawingFileRepository.save(drawingFile));
        }

        return uploadedFiles.stream().map(this::mapFileToResponse).collect(Collectors.toList());
    }

    public ResponseEntity<ByteArrayResource> downloadFile(Long fileId) throws IOException {
        DrawingFile file = drawingFileRepository.findById(fileId)
                .orElseThrow(() -> new ResourceNotFoundException("File not found with id: " + fileId));

        Path filePath = Paths.get(file.getFilePath());
        if (!Files.exists(filePath)) {
            throw new ResourceNotFoundException("File not found on disk: " + file.getOriginalFileName());
        }

        ByteArrayResource resource = new ByteArrayResource(Files.readAllBytes(filePath));
        String contentType = Files.probeContentType(filePath);
        if (contentType == null) contentType = "application/octet-stream";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getOriginalFileName() + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    public ResponseEntity<ByteArrayResource> downloadDrawingSetAsZip(Long id) throws IOException {
        DrawingSet drawingSet = drawingSetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drawing set not found with id: " + id));

        List<DrawingFile> files = drawingFileRepository.findByDrawingSet(drawingSet);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            for (DrawingFile file : files) {
                Path filePath = Paths.get(file.getFilePath());
                zos.putNextEntry(new ZipEntry(file.generateDownloadName()));
                Files.copy(filePath, zos);
                zos.closeEntry();
            }
        }

        String zipFilename = drawingSet.getName().replaceAll("[^A-Za-z0-9-]", "_") + ".zip";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + zipFilename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new ByteArrayResource(baos.toByteArray()));
    }

    public void deleteDrawingSet(Long id) {
        DrawingSet drawingSet = drawingSetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Drawing set not found with id: " + id));
        drawingSetRepository.delete(drawingSet);
    }

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

    private DrawingFileResponse mapFileToResponse(DrawingFile file) {
        return DrawingFileResponse.builder()
                .id(file.getId())
                .originalFileName(file.getOriginalFileName())
                .renamedFileName(file.generateDownloadName())
                .fileSize(file.getFileSize())
                .createdAt(file.getCreatedAt())
                .build();
    }
}
