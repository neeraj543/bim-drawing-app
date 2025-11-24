package com.bim.backend.repository;

import com.bim.backend.entity.Project;
import com.bim.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByOwner(User owner);

    List<Project> findByMembersContaining(User member);
}
