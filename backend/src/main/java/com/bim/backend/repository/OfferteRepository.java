package com.bim.backend.repository;

import com.bim.backend.entity.Offerte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OfferteRepository extends JpaRepository<Offerte, Long> {
    List<Offerte> findAllByOrderByDateDesc();
    List<Offerte> findByStatusOrderByDateDesc(Offerte.OfferteStatus status);
    boolean existsByOfferteNumber(String offerteNumber);

    @Query("SELECT o.offerteNumber FROM Offerte o WHERE o.offerteNumber LIKE :prefix%")
    List<String> findOfferteNumbersByYearPrefix(@Param("prefix") String prefix);
}
