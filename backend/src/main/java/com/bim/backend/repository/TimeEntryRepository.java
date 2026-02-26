package com.bim.backend.repository;

import com.bim.backend.entity.TimeEntry;
import com.bim.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {
    List<TimeEntry> findByUserOrderByDateDescCreatedAtDesc(User user);
    List<TimeEntry> findAllByOrderByDateDescCreatedAtDesc();
}
