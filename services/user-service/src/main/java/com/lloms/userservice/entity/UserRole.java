package com.lloms.userservice.entity;

/**
 * Enum representing the role of a user
 */
public enum UserRole {
    CUSTOMER("Customer"),
    ADMIN("Admin"),
    MANAGER("Manager"),
    OUTLET_STAFF("Outlet Staff"),
    FACTORY_STAFF("Factory Staff"),
    OWNER("Owner");
    
    private final String displayName;
    
    UserRole(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
