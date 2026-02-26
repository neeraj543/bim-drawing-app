package com.bim.backend.repository;

import com.bim.backend.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CompanyRepository extends JpaRepository<Company, Long> {
    List<Company> findAllByOrderByNameAsc();
}
