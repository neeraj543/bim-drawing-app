package com.bim.backend.repository;

import com.bim.backend.entity.DrawingFile;
import com.bim.backend.entity.DrawingSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DrawingFileRepository extends JpaRepository<DrawingFile, Long> {

    List<DrawingFile> findByDrawingSet(DrawingSet drawingSet);
}
