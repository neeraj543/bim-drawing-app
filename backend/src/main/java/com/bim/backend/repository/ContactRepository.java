package com.bim.backend.repository;

import com.bim.backend.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findAllByOrderByLastNameAscFirstNameAsc();
}
