package com.lloms.productservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * PriceHistory entity for tracking price changes
 * Provides audit trail for product pricing
 */
@Entity
@Table(name = "price_history", indexes = {
        @Index(name = "idx_price_history_product", columnList = "product_id"),
        @Index(name = "idx_price_history_date", columnList = "effective_date")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PriceHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Product is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull(message = "Previous price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Previous price must be non-negative")
    @Digits(integer = 10, fraction = 2, message = "Previous price must have at most 10 integer digits and 2 decimal places")
    @Column(name = "previous_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal previousPrice;

    @NotNull(message = "New price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "New price must be greater than 0")
    @Digits(integer = 10, fraction = 2, message = "New price must have at most 10 integer digits and 2 decimal places")
    @Column(name = "new_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal newPrice;

    @NotNull(message = "Effective date is required")
    @Column(name = "effective_date", nullable = false)
    private LocalDateTime effectiveDate;

    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "changed_by")
    private String changedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Business methods
    public BigDecimal getPriceChange() {
        return newPrice.subtract(previousPrice);
    }

    public BigDecimal getPriceChangePercentage() {
        if (previousPrice.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return getPriceChange().divide(previousPrice, 4, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    public boolean isPriceIncrease() {
        return getPriceChange().compareTo(BigDecimal.ZERO) > 0;
    }

    public boolean isPriceDecrease() {
        return getPriceChange().compareTo(BigDecimal.ZERO) < 0;
    }
}
