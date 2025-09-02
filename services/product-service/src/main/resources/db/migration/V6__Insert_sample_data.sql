-- Insert sample categories
INSERT INTO categories (name, description, status, sort_order, created_by) VALUES
('Bakery', 'Fresh baked goods and pastries', 'ACTIVE', 1, 'system'),
('Bread', 'Various types of bread', 'ACTIVE', 2, 'system'),
('Cakes', 'Birthday cakes and desserts', 'ACTIVE', 3, 'system'),
('Cookies', 'Sweet and savory cookies', 'ACTIVE', 4, 'system'),
('Beverages', 'Drinks and refreshments', 'ACTIVE', 5, 'system');

-- Update parent relationships
UPDATE categories SET parent_id = 1 WHERE name IN ('Bread', 'Cakes', 'Cookies');

-- Insert sample outlets
INSERT INTO outlets (name, code, address, phone, email, status, created_by) VALUES
('Main Branch', 'MAIN001', '123 Main Street, Colombo', '+94-11-1234567', 'main@littlelanka.com', 'ACTIVE', 'system'),
('Galle Branch', 'GALLE001', '456 Galle Road, Galle', '+94-91-1234567', 'galle@littlelanka.com', 'ACTIVE', 'system'),
('Kandy Branch', 'KANDY001', '789 Kandy Road, Kandy', '+94-81-1234567', 'kandy@littlelanka.com', 'ACTIVE', 'system');

-- Insert sample products
INSERT INTO products (name, description, price, cost_price, stock_quantity, min_stock_level, sku, barcode, category_id, outlet_id, status, unit, is_taxable, tax_rate, created_by) VALUES
('White Bread', 'Fresh white bread loaf', 120.00, 80.00, 50, 10, 'WB001', '1234567890123', 2, 1, 'ACTIVE', 'loaf', true, 15.00, 'system'),
('Brown Bread', 'Whole wheat brown bread', 140.00, 90.00, 30, 10, 'BB001', '1234567890124', 2, 1, 'ACTIVE', 'loaf', true, 15.00, 'system'),
('Chocolate Cake', 'Rich chocolate birthday cake', 2500.00, 1800.00, 5, 2, 'CC001', '1234567890125', 3, 1, 'ACTIVE', 'cake', true, 15.00, 'system'),
('Vanilla Cupcakes', 'Delicious vanilla cupcakes', 150.00, 100.00, 20, 5, 'VC001', '1234567890126', 3, 1, 'ACTIVE', 'piece', true, 15.00, 'system'),
('Chocolate Chip Cookies', 'Classic chocolate chip cookies', 80.00, 50.00, 100, 20, 'CCC001', '1234567890127', 4, 1, 'ACTIVE', 'pack', true, 15.00, 'system'),
('Butter Cookies', 'Traditional butter cookies', 90.00, 60.00, 80, 15, 'BC001', '1234567890128', 4, 1, 'ACTIVE', 'pack', true, 15.00, 'system'),
('Fresh Milk', 'Fresh cow milk', 200.00, 150.00, 25, 5, 'FM001', '1234567890129', 5, 1, 'ACTIVE', 'liter', true, 15.00, 'system'),
('Orange Juice', 'Fresh orange juice', 180.00, 120.00, 15, 3, 'OJ001', '1234567890130', 5, 1, 'ACTIVE', 'bottle', true, 15.00, 'system');
