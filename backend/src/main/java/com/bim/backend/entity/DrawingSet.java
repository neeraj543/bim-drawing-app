package com.bim.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "drawing_sets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DrawingSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "revision_number")
    private String revisionNumber;

    @Column(name = "is_latest")
    @Builder.Default
    private Boolean isLatest = false;

    @OneToMany(mappedBy = "drawingSet", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<DrawingFile> drawingFiles = new HashSet<>();

    @OneToMany(mappedBy = "drawingSet", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<Task> tasks = new HashSet<>();

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

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
