package com.lloms.productservice.dto.response;

import com.lloms.productservice.entity.enums.ProductStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO for product response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private BigDecimal costPrice;
    private Integer stockQuantity;
    private Integer minStockLevel;
    private String sku;
    private String barcode;
    private Long categoryId;
    private String categoryName;
    private Long outletId;
    private String outletName;
    private ProductStatus status;
    private String imageUrl;
    private BigDecimal weight;
    private String unit;
    private Boolean isTaxable;
    private BigDecimal taxRate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String updatedBy;
    private Long version;

    // Computed fields
    private BigDecimal profitMargin;
    private BigDecimal taxAmount;
    private BigDecimal priceWithTax;
    private Boolean isLowStock;
    private Boolean isOutOfStock;
}
