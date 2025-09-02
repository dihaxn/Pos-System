package com.lloms.productservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Product entity representing a product in the system
 * Implements soft delete pattern for data integrity
 */
@Entity
@Table(name = "products", indexes = {
        @Index(name = "idx_product_name", columnList = "name"),
        @Index(name = "idx_product_category", columnList = "category_id"),
        @Index(name = "idx_product_status", columnList = "status"),
        @Index(name = "idx_product_created_at", columnList = "created_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE products SET deleted = true WHERE id = ?")
@Where(clause = "deleted = false")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Size(max = 255, message = "Product name must not exceed 255 characters")
    @Column(name = "name", nullable = false)
    private String name;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    @Column(name = "description", length = 1000)
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "Price must have at most 10 integer digits and 2 decimal places")
    @Column(name = "price", nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @NotNull(message = "Cost price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Cost price must be non-negative")
    @Digits(integer = 10, fraction = 2, message = "Cost price must have at most 10 integer digits and 2 decimal places")
    @Column(name = "cost_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal costPrice;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must be non-negative")
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @Min(value = 0, message = "Minimum stock level must be non-negative")
    @Column(name = "min_stock_level")
    private Integer minStockLevel;

    @Size(max = 50, message = "SKU must not exceed 50 characters")
    @Column(name = "sku", unique = true)
    private String sku;

    @Size(max = 100, message = "Barcode must not exceed 100 characters")
    @Column(name = "barcode")
    private String barcode;

    @NotNull(message = "Category is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @NotNull(message = "Outlet is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "outlet_id", nullable = false)
    private Outlet outlet;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private ProductStatus status = ProductStatus.ACTIVE;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "weight")
    private BigDecimal weight;

    @Size(max = 50, message = "Unit must not exceed 50 characters")
    @Column(name = "unit")
    private String unit;

    @Column(name = "is_taxable")
    @Builder.Default
    private Boolean isTaxable = true;

    @DecimalMin(value = "0.0", message = "Tax rate must be non-negative")
    @DecimalMax(value = "100.0", message = "Tax rate must not exceed 100%")
    @Column(name = "tax_rate", precision = 5, scale = 2)
    private BigDecimal taxRate;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "deleted", nullable = false)
    @Builder.Default
    private Boolean deleted = false;

    @Column(name = "version")
    @Version
    private Long version;

    // Relationships
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<PriceHistory> priceHistories = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<StockMovement> stockMovements = new ArrayList<>();

    // Business methods
    public boolean isLowStock() {
        return minStockLevel != null && stockQuantity <= minStockLevel;
    }

    public boolean isOutOfStock() {
        return stockQuantity <= 0;
    }

    public void updateStock(Integer quantity, String reason) {
        if (quantity == null || quantity == 0) {
            return;
        }

        this.stockQuantity += quantity;

        // Create stock movement record
        StockMovement movement = StockMovement.builder()
                .product(this)
                .quantity(quantity)
                .reason(reason)
                .build();

        this.stockMovements.add(movement);
    }

    public BigDecimal calculateProfitMargin() {
        if (costPrice == null || costPrice.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return price.subtract(costPrice).divide(costPrice, 4, BigDecimal.ROUND_HALF_UP);
    }

    public BigDecimal calculateTaxAmount() {
        if (!isTaxable || taxRate == null) {
            return BigDecimal.ZERO;
        }
        return price.multiply(taxRate).divide(BigDecimal.valueOf(100), 2, BigDecimal.ROUND_HALF_UP);
    }

    public BigDecimal getPriceWithTax() {
        return price.add(calculateTaxAmount());
    }
}
