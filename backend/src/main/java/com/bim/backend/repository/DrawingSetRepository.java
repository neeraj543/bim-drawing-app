package com.bim.backend.repository;

import com.bim.backend.entity.DrawingSet;
import com.bim.backend.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DrawingSetRepository extends JpaRepository<DrawingSet, Long> {

    List<DrawingSet> findByProject(Project project);

    Optional<DrawingSet> findByProjectAndIsLatestTrue(Project project);

    List<DrawingSet> findByProjectOrderByCreatedAtDesc(Project project);
}
