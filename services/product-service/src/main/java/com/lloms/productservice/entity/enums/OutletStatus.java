package com.lloms.productservice.entity.enums;

/**
 * Enum representing the status of an outlet
 */
public enum OutletStatus {
    ACTIVE("Active"),
    INACTIVE("Inactive"),
    MAINTENANCE("Under Maintenance"),
    CLOSED("Closed");

    private final String displayName;

    OutletStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
