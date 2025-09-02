-- Create price_history table
CREATE TABLE price_history (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    previous_price DECIMAL(12,2) NOT NULL,
    new_price DECIMAL(12,2) NOT NULL,
    effective_date TIMESTAMP NOT NULL,
    reason VARCHAR(500),
    changed_by VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_price_history_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT chk_price_history_previous_price CHECK (previous_price >= 0),
    CONSTRAINT chk_price_history_new_price CHECK (new_price > 0)
);

-- Create indexes
CREATE INDEX idx_price_history_product ON price_history(product_id);
CREATE INDEX idx_price_history_date ON price_history(effective_date);
