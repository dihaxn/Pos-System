-- Create product_analytics table
CREATE TABLE product_analytics (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255),
    category VARCHAR(255),
    outlet_id BIGINT NOT NULL,
    total_quantity_sold INTEGER,
    total_revenue DECIMAL(10,2),
    average_price DECIMAL(10,2),
    stock_turnover_rate DOUBLE PRECISION,
    analysis_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_product_analytics_product_id ON product_analytics(product_id);
CREATE INDEX idx_product_analytics_outlet_id ON product_analytics(outlet_id);
CREATE INDEX idx_product_analytics_analysis_date ON product_analytics(analysis_date);
CREATE INDEX idx_product_analytics_category ON product_analytics(category);
CREATE INDEX idx_product_analytics_outlet_date ON product_analytics(outlet_id, analysis_date);
