package com.bim.backend.entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DrawingFileTest {

    private DrawingFile drawingFile;
    private DrawingSet mockDrawingSet;
    private Project mockProject;

    @BeforeEach
    void setUp() {
        // Create mock project
        mockProject = mock(Project.class);
        when(mockProject.getProjectNumber()).thenReturn("2025001");
        when(mockProject.getProjectName()).thenReturn("Wiekevorst");

        // Create mock drawing set
        mockDrawingSet = mock(DrawingSet.class);
        when(mockDrawingSet.getProject()).thenReturn(mockProject);
        when(mockDrawingSet.getRevisionNumber()).thenReturn("01");

        // Create drawing file
        drawingFile = DrawingFile.builder()
                .drawingSet(mockDrawingSet)
                .build();
    }

    @Test
    void testGenerateDownloadName_HappyPath() {
        // Given: All fields are present
        drawingFile.setOriginalFileName("floor-plan.pdf");
        drawingFile.setFloor("Gelijkvloers");
        drawingFile.setDesignerInitials("eDP");

        // When
        String result = drawingFile.generateDownloadName();

        // Then
        assertEquals("2025001_Wiekevorst_PROD_Gelijkvloers_01_eDP.pdf", result);
    }

    @Test
    void testGenerateDownloadName_MissingFloor() {
        // Given: Floor is null
        drawingFile.setOriginalFileName("floor-plan.pdf");
        drawingFile.setFloor(null);
        drawingFile.setDesignerInitials("eDP");

        // When
        String result = drawingFile.generateDownloadName();

        // Then: Should handle null floor gracefully with empty string
        assertEquals("2025001_Wiekevorst_PROD__01_eDP.pdf", result);
    }

    @Test
    void testGenerateDownloadName_MissingDesignerInitials() {
        // Given: Designer initials is null
        drawingFile.setOriginalFileName("floor-plan.pdf");
        drawingFile.setFloor("Gelijkvloers");
        drawingFile.setDesignerInitials(null);

        // When
        String result = drawingFile.generateDownloadName();

        // Then: Should handle null designer initials gracefully with empty string
        assertEquals("2025001_Wiekevorst_PROD_Gelijkvloers_01_.pdf", result);
    }

    @Test
    void testGenerateDownloadName_DifferentExtensions() {
        // Given: Different file extensions
        drawingFile.setFloor("Verdieping1");
        drawingFile.setDesignerInitials("JD");

        // Test .PDF (uppercase)
        drawingFile.setOriginalFileName("drawing.PDF");
        assertEquals("2025001_Wiekevorst_PROD_Verdieping1_01_JD.PDF", drawingFile.generateDownloadName());

        // Test .dwg
        drawingFile.setOriginalFileName("drawing.dwg");
        assertEquals("2025001_Wiekevorst_PROD_Verdieping1_01_JD.dwg", drawingFile.generateDownloadName());

        // Test .pdf (lowercase)
        drawingFile.setOriginalFileName("drawing.pdf");
        assertEquals("2025001_Wiekevorst_PROD_Verdieping1_01_JD.pdf", drawingFile.generateDownloadName());
    }

    @Test
    void testGenerateDownloadName_SpecialCharactersInProjectName() {
        // Given: Project name with spaces and hyphens
        when(mockProject.getProjectName()).thenReturn("Office-Building Downtown");
        when(mockProject.getProjectNumber()).thenReturn("BIM-2025-001");

        drawingFile.setOriginalFileName("plan.pdf");
        drawingFile.setFloor("Ground Floor");
        drawingFile.setDesignerInitials("ABC");

        // When
        String result = drawingFile.generateDownloadName();

        // Then: Should preserve special characters in project name and floor
        assertEquals("BIM-2025-001_Office-Building Downtown_PROD_Ground Floor_01_ABC.pdf", result);
    }

    @Test
    void testGenerateDownloadName_NoExtension() {
        // Given: File without extension
        drawingFile.setOriginalFileName("drawing");
        drawingFile.setFloor("Gelijkvloers");
        drawingFile.setDesignerInitials("eDP");

        // When
        String result = drawingFile.generateDownloadName();

        // Then: Should handle files without extension
        assertEquals("2025001_Wiekevorst_PROD_Gelijkvloers_01_eDP", result);
    }
}
