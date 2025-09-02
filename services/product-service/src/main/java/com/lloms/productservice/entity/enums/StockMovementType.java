package com.lloms.productservice.entity.enums;

/**
 * Enum representing the type of stock movement
 */
public enum StockMovementType {
    INBOUND("Inbound"),
    OUTBOUND("Outbound"),
    ADJUSTMENT("Adjustment"),
    TRANSFER_IN("Transfer In"),
    TRANSFER_OUT("Transfer Out"),
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
