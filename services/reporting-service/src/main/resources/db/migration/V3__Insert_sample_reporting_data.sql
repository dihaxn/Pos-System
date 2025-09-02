-- Insert sample sales reports data
INSERT INTO sales_reports (outlet_id, outlet_name, report_date, total_sales, total_orders, total_items_sold, average_order_value, top_selling_product, top_selling_category, report_type) VALUES
(1, 'Main Branch', '2024-01-15 00:00:00', 1250.50, 45, 120, 27.79, 'Traditional Curry Powder', 'Spices', 'DAILY'),
(1, 'Main Branch', '2024-01-14 00:00:00', 1180.25, 42, 115, 28.10, 'Ceylon Tea', 'Beverages', 'DAILY'),
(1, 'Main Branch', '2024-01-13 00:00:00', 1320.75, 48, 125, 27.52, 'Traditional Curry Powder', 'Spices', 'DAILY'),
(2, 'Branch 2', '2024-01-15 00:00:00', 980.30, 35, 95, 28.01, 'Coconut Oil', 'Oils', 'DAILY'),
(2, 'Branch 2', '2024-01-14 00:00:00', 1050.60, 38, 100, 27.65, 'Ceylon Tea', 'Beverages', 'DAILY'),
(1, 'Main Branch', '2024-01-08 00:00:00', 8750.25, 315, 840, 27.78, 'Ceylon Tea', 'Beverages', 'WEEKLY'),
(2, 'Branch 2', '2024-01-08 00:00:00', 7200.50, 260, 680, 27.69, 'Coconut Oil', 'Oils', 'WEEKLY'),
(1, 'Main Branch', '2024-01-01 00:00:00', 37500.75, 1350, 3600, 27.78, 'Traditional Curry Powder', 'Spices', 'MONTHLY'),
(2, 'Branch 2', '2024-01-01 00:00:00', 31200.40, 1120, 2800, 27.86, 'Coconut Oil', 'Oils', 'MONTHLY');

-- Insert sample product analytics data
INSERT INTO product_analytics (product_id, product_name, category, outlet_id, total_quantity_sold, total_revenue, average_price, stock_turnover_rate, analysis_date) VALUES
(1, 'Traditional Curry Powder', 'Spices', 1, 150, 2398.50, 15.99, 2.5, '2024-01-15 00:00:00'),
(2, 'Ceylon Tea', 'Beverages', 1, 200, 2500.00, 12.50, 3.2, '2024-01-15 00:00:00'),
(3, 'Coconut Oil', 'Oils', 1, 75, 674.25, 8.99, 1.8, '2024-01-15 00:00:00'),
(1, 'Traditional Curry Powder', 'Spices', 2, 120, 1918.80, 15.99, 2.1, '2024-01-15 00:00:00'),
(2, 'Ceylon Tea', 'Beverages', 2, 180, 2250.00, 12.50, 2.9, '2024-01-15 00:00:00'),
(3, 'Coconut Oil', 'Oils', 2, 110, 988.90, 8.99, 2.3, '2024-01-15 00:00:00'),
(4, 'Sri Lankan Rice', 'Grains', 1, 80, 1200.00, 15.00, 1.5, '2024-01-15 00:00:00'),
(5, 'Cinnamon Sticks', 'Spices', 1, 60, 900.00, 15.00, 2.0, '2024-01-15 00:00:00');
