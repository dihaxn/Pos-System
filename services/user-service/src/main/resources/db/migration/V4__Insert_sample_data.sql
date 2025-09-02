-- Insert sample data
INSERT INTO users (username, email, password, first_name, last_name, phone_number, status, role, is_email_verified, created_by) VALUES
('superadmin', 'superadmin@lloms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Super', 'Admin', '+1234567890', 'ACTIVE', 'SUPER_ADMIN', TRUE, 'system'),
('admin', 'admin@lloms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Admin', 'User', '+1234567891', 'ACTIVE', 'ADMIN', TRUE, 'system'),
('manager1', 'manager1@lloms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Manager', 'One', '+1234567892', 'ACTIVE', 'MANAGER', TRUE, 'system'),
('cashier1', 'cashier1@lloms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Cashier', 'One', '+1234567893', 'ACTIVE', 'CASHIER', TRUE, 'system'),
('customer1', 'customer1@lloms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Customer', 'One', '+1234567894', 'ACTIVE', 'CUSTOMER', TRUE, 'system'),
('customer2', 'customer2@lloms.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDi', 'Customer', 'Two', '+1234567895', 'PENDING_VERIFICATION', 'CUSTOMER', FALSE, 'system');

-- Note: The password hash above is for 'password123' - change this in production!
