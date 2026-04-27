package com.bim.backend.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OfferteLineItemDto {
    private Long id;
    private String description;
    private BigDecimal quantity;
    private String unit;
    private BigDecimal pricePerUnit;
    private Integer sortOrder;
    private String section; // STRUCTUUR or EXTRA
}
