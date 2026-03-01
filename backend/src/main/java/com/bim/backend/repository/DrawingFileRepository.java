package com.bim.backend.repository;

import com.bim.backend.entity.DrawingFile;
import com.bim.backend.entity.DrawingSet;
import com.bim.backend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DrawingFileRepository extends JpaRepository<DrawingFile, Long> {

    List<DrawingFile> findByDrawingSet(DrawingSet drawingSet);

    @Modifying
    @Query("DELETE FROM DrawingFile f WHERE f.drawingSet IN (SELECT ds FROM DrawingSet ds WHERE ds.project = :project)")
    void deleteAllByProject(@Param("project") Project project);
}
