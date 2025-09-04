package com.lloms.userservice.entity;

/**
 * Enum representing session status
 */
public enum SessionStatus {
    ACTIVE("Active"),
    EXPIRED("Expired"),
    TERMINATED("Terminated"),
    SUSPENDED("Suspended");
    
    private final String displayName;
    
    SessionStatus(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
