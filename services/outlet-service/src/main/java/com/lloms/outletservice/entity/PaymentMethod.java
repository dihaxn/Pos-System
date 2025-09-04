package com.lloms.outletservice.entity;

/**
 * Enum representing payment methods
 */
public enum PaymentMethod {
    CASH("Cash"),
    CARD("Card"),
    MOBILE_PAYMENT("Mobile Payment"),
    BANK_TRANSFER("Bank Transfer"),
    CREDIT("Credit");
    
    private final String displayName;
    
    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
