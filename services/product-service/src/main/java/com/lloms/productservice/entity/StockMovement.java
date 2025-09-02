package com.lloms.productservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * StockMovement entity for tracking stock changes
 * Provides audit trail for inventory management
 */
@Entity
@Table(name = "stock_movements", indexes = {
        @Index(name = "idx_stock_movement_product", columnList = "product_id"),
        @Index(name = "idx_stock_movement_date", columnList = "created_at"),
        @Index(name = "idx_stock_movement_type", columnList = "movement_type")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Product is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @NotNull(message = "Quantity is required")
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @NotNull(message = "Movement type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false)
    private StockMovementType movementType;

    @Size(max = 500, message = "Reason must not exceed 500 characters")
    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "reference_id")
    private String referenceId; // Order ID, Purchase ID, etc.

    @Column(name = "reference_type")
    private String referenceType; // ORDER, PURCHASE, ADJUSTMENT, etc.

    @Column(name = "performed_by")
    private String performedBy;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Business methods
    public boolean isInbound() {
        return movementType == StockMovementType.INBOUND;
    }

    public boolean isOutbound() {
        return movementType == StockMovementType.OUTBOUND;
    }

    public boolean isAdjustment() {
        return movementType == StockMovementType.ADJUSTMENT;
    }

    public Integer getEffectiveQuantity() {
        return isInbound() ? quantity : -quantity;
    }
}
