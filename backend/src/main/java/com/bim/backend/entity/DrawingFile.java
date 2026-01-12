package com.bim.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "drawing_files")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrawingFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drawing_set_id", nullable = false)
    private DrawingSet drawingSet;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false)
    private String storedFileName; // UUID-based filename on disk

    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false)
    private Long fileSize;

    // Metadata fields for dynamic name generation
    @Column(name = "sheet_number")
    private String sheetNumber; // e.g., "A101", "E201"

    @Column(name = "floor")
    private String floor; // e.g., "GroundFloor", "FirstFloor"

    @Column(name = "designer_initials")
    private String designerInitials; // e.g., "eDP"

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * Generates the standardized download name for this drawing file.
     * Format: {projectNumber}_{projectName}_PROD_{version}_{designerInitials}.pdf
     * Example: 2025001_Wiekevorst_PROD_RevA_eDP.pdf
     *
     * @return the generated download filename
     */
    public String generateDownloadName() {
        String projectNumber = this.drawingSet.getProject().getProjectNumber();
        String projectName = this.drawingSet.getProject().getProjectName();
        String version = this.drawingSet.getRevisionNumber();
        String initials = this.designerInitials != null ? this.designerInitials : "";

        // Extract file extension from original filename
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        return String.format("%s_%s_PROD_%s_%s%s",
                projectNumber,
                projectName,
                version,
                initials,
                extension);
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
