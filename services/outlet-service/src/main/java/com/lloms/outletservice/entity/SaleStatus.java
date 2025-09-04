package com.lloms.outletservice.entity;

/**
 * Enum representing sale status
 */
public enum SaleStatus {
    PENDING("Pending"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled"),
    REFUNDED("Refunded");
    
    private final String displayName;
    
    SaleStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
