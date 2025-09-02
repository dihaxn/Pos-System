-- Create sales_reports table
CREATE TABLE sales_reports (
    id BIGSERIAL PRIMARY KEY,
    outlet_id BIGINT NOT NULL,
    outlet_name VARCHAR(255),
    report_date TIMESTAMP NOT NULL,
    total_sales DECIMAL(10,2),
    total_orders INTEGER,
    total_items_sold INTEGER,
    average_order_value DECIMAL(10,2),
    top_selling_product VARCHAR(255),
    top_selling_category VARCHAR(255),
    report_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_sales_reports_outlet_id ON sales_reports(outlet_id);
CREATE INDEX idx_sales_reports_report_date ON sales_reports(report_date);
CREATE INDEX idx_sales_reports_report_type ON sales_reports(report_type);
CREATE INDEX idx_sales_reports_outlet_date_type ON sales_reports(outlet_id, report_date, report_type);
