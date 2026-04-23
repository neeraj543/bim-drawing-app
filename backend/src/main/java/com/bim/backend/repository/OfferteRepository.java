package com.bim.backend.repository;

import com.bim.backend.entity.Offerte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferteRepository extends JpaRepository<Offerte, Long> {
    List<Offerte> findAllByOrderByDateDesc();
    List<Offerte> findByStatusOrderByDateDesc(Offerte.OfferteStatus status);
    boolean existsByOfferteNumber(String offerteNumber);
}
