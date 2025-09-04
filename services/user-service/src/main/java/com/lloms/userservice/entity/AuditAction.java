package com.lloms.userservice.entity;

/**
 * Enum representing audit actions
 */
public enum AuditAction {
    CREATE("Create"),
    UPDATE("Update"),
    DELETE("Delete"),
    LOGIN("Login"),
    LOGOUT("Logout"),
    PASSWORD_CHANGE("Password Change"),
    PROFILE_UPDATE("Profile Update");
    
    private final String displayName;
    
    AuditAction(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}
