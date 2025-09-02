-- Create audit_logs table
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(100),
    old_values TEXT,
    new_values TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    session_id VARCHAR(255),
    action_type ENUM('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 
                     'PASSWORD_CHANGE', 'EMAIL_VERIFICATION', 'ACCOUNT_LOCK', 'ACCOUNT_UNLOCK',
                     'ROLE_CHANGE', 'STATUS_CHANGE', 'MFA_ENABLE', 'MFA_DISABLE',
                     'SESSION_CREATE', 'SESSION_REVOKE', 'FAILED_LOGIN', 'PASSWORD_RESET_REQUEST',
                     'PASSWORD_RESET_COMPLETE') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_timestamp (timestamp),
    INDEX idx_audit_action_type (action_type),
    INDEX idx_audit_resource (resource_type, resource_id)
);
