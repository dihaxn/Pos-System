package com.lloms.outletservice.entity;

import com.lloms.outletservice.entity.enums.PaymentMethod;
import com.lloms.outletservice.entity.enums.SaleStatus;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "sales")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Sale {

    @Id
    private String id;

    @NotBlank(message = "Sale number is required")
    @Indexed(unique = true)
    private String saleNumber;

    @NotBlank(message = "Outlet ID is required")
    @Field("outlet_id")
    @Indexed
    private String outletId;

    @NotBlank(message = "Cashier ID is required")
    @Field("cashier_id")
    @Indexed
    private String cashierId;

    @Field("customer_id")
    private String customerId;

    @NotNull(message = "Sale items are required")
    @Field("sale_items")
    private List<SaleItem> saleItems;

    @NotNull(message = "Subtotal is required")
    @DecimalMin(value = "0.0", message = "Subtotal must be non-negative")
    private BigDecimal subtotal;

    @NotNull(message = "Tax amount is required")
    @DecimalMin(value = "0.0", message = "Tax amount must be non-negative")
    @Field("tax_amount")
    private BigDecimal taxAmount;

    @NotNull(message = "Discount amount is required")
    @DecimalMin(value = "0.0", message = "Discount amount must be non-negative")
    @Field("discount_amount")
    private BigDecimal discountAmount;

    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.0", message = "Total amount must be non-negative")
    @Field("total_amount")
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SaleStatus status = SaleStatus.COMPLETED;

    @Enumerated(EnumType.STRING)
    @Field("payment_method")
    private PaymentMethod paymentMethod;

    @Field("payment_reference")
    private String paymentReference;

    @Field("pos_terminal_id")
    private String posTerminalId;

    @Field("receipt_number")
    private String receiptNumber;

    @Field("notes")
    private String notes;

    @Field("refund_reason")
    private String refundReason;

    @Field("refunded_by")
    private String refundedBy;

    @Field("refunded_at")
    private LocalDateTime refundedAt;

    @Field("created_at")
    @CreatedDate
    private LocalDateTime createdAt;

    @Field("updated_at")
    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Field("created_by")
    private String createdBy;

    @Field("updated_by")
    private String updatedBy;

    @Version
    private Long version;

    // Helper methods
    public boolean isRefunded() {
        return status == SaleStatus.REFUNDED;
    }

    public boolean isCompleted() {
        return status == SaleStatus.COMPLETED;
    }

    public void calculateTotal() {
        if (saleItems != null) {
            subtotal = saleItems.stream()
                    .map(SaleItem::getTotalPrice)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }

        if (subtotal != null && taxAmount != null && discountAmount != null) {
            totalAmount = subtotal.add(taxAmount).subtract(discountAmount);
        }
    }
}
