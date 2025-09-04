package com.lloms.productservice.entity;

/**
 * Enum representing the status of a category
 */
public enum CategoryStatus {
    ACTIVE("Active"),
    INACTIVE("Inactive"),
    ARCHIVED("Archived");
    
    private final String displayName;
    
    CategoryStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
