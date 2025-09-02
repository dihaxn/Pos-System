package com.lloms.outletservice.entity;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SaleItem {

    @NotBlank(message = "Product ID is required")
    @Field("product_id")
    private String productId;

    @NotBlank(message = "Product name is required")
    @Field("product_name")
    private String productName;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.0", message = "Unit price must be non-negative")
    @Field("unit_price")
    private BigDecimal unitPrice;

    @NotNull(message = "Total price is required")
    @DecimalMin(value = "0.0", message = "Total price must be non-negative")
    @Field("total_price")
    private BigDecimal totalPrice;

    @DecimalMin(value = "0.0", message = "Discount must be non-negative")
    private BigDecimal discount;

    @Field("discount_percentage")
    @DecimalMin(value = "0.0", message = "Discount percentage must be non-negative")
    @DecimalMax(value = "100.0", message = "Discount percentage must not exceed 100")
    private BigDecimal discountPercentage;

    @Field("tax_rate")
    @DecimalMin(value = "0.0", message = "Tax rate must be non-negative")
    @DecimalMax(value = "100.0", message = "Tax rate must not exceed 100")
    private BigDecimal taxRate;

    @Field("tax_amount")
    @DecimalMin(value = "0.0", message = "Tax amount must be non-negative")
    private BigDecimal taxAmount;

    // Helper methods
    public void calculateTotalPrice() {
        if (quantity != null && unitPrice != null) {
            totalPrice = unitPrice.multiply(BigDecimal.valueOf(quantity));

            if (discount != null) {
                totalPrice = totalPrice.subtract(discount);
            } else if (discountPercentage != null) {
                BigDecimal discountAmount = totalPrice.multiply(discountPercentage.divide(BigDecimal.valueOf(100)));
                totalPrice = totalPrice.subtract(discountAmount);
            }

            if (taxRate != null) {
                taxAmount = totalPrice.multiply(taxRate.divide(BigDecimal.valueOf(100)));
            }
        }
    }
}
