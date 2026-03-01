package com.bim.backend.repository;

import com.bim.backend.entity.Project;
import com.bim.backend.entity.TimeEntry;
import com.bim.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {
    List<TimeEntry> findByUserOrderByDateDescCreatedAtDesc(User user);
    List<TimeEntry> findAllByOrderByDateDescCreatedAtDesc();

    @Modifying
    @Query("UPDATE TimeEntry t SET t.project = null WHERE t.project = :project")
    void clearProjectFromTimeEntries(@Param("project") Project project);
}
