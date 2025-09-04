package com.lloms.productservice.entity;

/**
 * Enum representing the type of stock movement
 */
public enum StockMovementType {
    IN("Stock In"),
    OUT("Stock Out"),
    ADJUSTMENT("Stock Adjustment"),
    RETURN("Return"),
    DAMAGE("Damage"),
    EXPIRED("Expired");
    
    private final String displayName;
    
    StockMovementType(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
