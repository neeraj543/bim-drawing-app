package com.bim.backend.repository;

import com.bim.backend.entity.Project;
import com.bim.backend.entity.Task;
import com.bim.backend.entity.DrawingSet;
import com.bim.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Modifying
    @Query("DELETE FROM Task t WHERE t.drawingSet IN (SELECT ds FROM DrawingSet ds WHERE ds.project = :project)")
    void deleteAllByProject(@Param("project") Project project);

    // Find all tasks assigned to a specific user
    List<Task> findByAssignedUser(User assignedUser);

    // Find all tasks for a specific drawing set
    List<Task> findByDrawingSet(DrawingSet drawingSet);

    // Find tasks by status
    List<Task> findByStatus(Task.TaskStatus status);

    // Find tasks by assigned user and status
    List<Task> findByAssignedUserAndStatus(User assignedUser, Task.TaskStatus status);

    // Find tasks by drawing set and status
    List<Task> findByDrawingSetAndStatus(DrawingSet drawingSet, Task.TaskStatus status);

    // Find tasks by priority
    List<Task> findByPriority(Task.Priority priority);

    // Find tasks created by a specific user (admin/mentor)
    List<Task> findByCreatedBy(User createdBy);
}
