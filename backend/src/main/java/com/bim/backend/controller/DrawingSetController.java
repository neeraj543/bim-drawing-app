package com.bim.backend.controller;

import com.bim.backend.dto.DrawingFileResponse;
import com.bim.backend.dto.DrawingSetCreateRequest;
import com.bim.backend.dto.DrawingSetResponse;
import com.bim.backend.service.DrawingSetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api")
public class DrawingSetController {

    @Autowired
    private DrawingSetService drawingSetService;

    @PostMapping("/projects/{projectId}/drawing-sets")
    public ResponseEntity<DrawingSetResponse> createDrawingSet(@PathVariable Long projectId, @RequestBody DrawingSetCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(drawingSetService.createDrawingSet(projectId, request));
    }

    @GetMapping("/projects/{projectId}/drawing-sets")
    public ResponseEntity<List<DrawingSetResponse>> getDrawingSetsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(drawingSetService.getDrawingSetsByProject(projectId));
    }

    @GetMapping("/drawing-sets/{id}")
    public ResponseEntity<DrawingSetResponse> getDrawingSetById(@PathVariable Long id) {
        return ResponseEntity.ok(drawingSetService.getDrawingSetById(id));
    }

    @GetMapping("/drawing-sets/{id}/files")
    public ResponseEntity<List<DrawingFileResponse>> getFilesByDrawingSet(@PathVariable Long id) {
        return ResponseEntity.ok(drawingSetService.getFilesByDrawingSet(id));
    }

    @PostMapping("/drawing-sets/{setId}/upload")
    public ResponseEntity<List<DrawingFileResponse>> uploadFiles(
            @PathVariable Long setId,
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("floors") String[] floors,
            @RequestParam("designerInitials") String[] designerInitials) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(drawingSetService.uploadFiles(setId, files, floors, designerInitials));
    }

    @GetMapping("/files/{fileId}")
    public ResponseEntity<ByteArrayResource> downloadFile(@PathVariable Long fileId) throws IOException {
        return drawingSetService.downloadFile(fileId);
    }

    @GetMapping("/drawing-sets/{id}/download")
    public ResponseEntity<ByteArrayResource> downloadDrawingSetAsZip(@PathVariable Long id) throws IOException {
        return drawingSetService.downloadDrawingSetAsZip(id);
    }

    @DeleteMapping("/drawing-sets/{id}")
    public ResponseEntity<Void> deleteDrawingSet(@PathVariable Long id) {
        drawingSetService.deleteDrawingSet(id);
        return ResponseEntity.noContent().build();
    }
}
