package com.bim.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "offerte_line_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "offerte")
@EqualsAndHashCode(exclude = "offerte")
public class OfferteLineItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offerte_id", nullable = false)
    private Offerte offerte;

    private String description;
    private BigDecimal quantity;
    private String unit; // m², m³, pce, forfait, ...
    private BigDecimal pricePerUnit;
    private Integer sortOrder;
}
