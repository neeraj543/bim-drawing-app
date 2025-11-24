package com.bim.backend.repository;

import com.bim.backend.entity.Task;
import com.bim.backend.entity.Project;
import com.bim.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByProject(Project project);

    List<Task> findByAssignedTo(User assignedTo);

    List<Task> findByProjectAndStatus(Project project, Task.TaskStatus status);
}
