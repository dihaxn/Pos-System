package com.lloms.outletservice.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InventorySettings {

    private boolean lowStockAlert;
    private int lowStockThreshold;
    private boolean autoReorder;
    private int reorderThreshold;
    private boolean trackExpiry;
    private int expiryAlertDays;
    private String defaultSupplier;
    private String currency;
    private String timezone;
}
