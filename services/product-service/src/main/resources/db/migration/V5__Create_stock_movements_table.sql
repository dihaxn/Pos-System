-- Create stock_movements table
CREATE TABLE stock_movements (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    movement_type VARCHAR(20) NOT NULL,
    reason VARCHAR(500),
    reference_id VARCHAR(100),
    reference_type VARCHAR(50),
    performed_by VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_stock_movements_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT chk_stock_movements_type CHECK (movement_type IN ('INBOUND', 'OUTBOUND', 'ADJUSTMENT', 'TRANSFER_IN', 'TRANSFER_OUT', 'RETURN', 'DAMAGE', 'EXPIRED'))
);

-- Create indexes
CREATE INDEX idx_stock_movement_product ON stock_movements(product_id);
CREATE INDEX idx_stock_movement_date ON stock_movements(created_at);
CREATE INDEX idx_stock_movement_type ON stock_movements(movement_type);
