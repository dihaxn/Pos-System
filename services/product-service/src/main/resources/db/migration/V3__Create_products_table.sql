-- Create products table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    price DECIMAL(12,2) NOT NULL,
    cost_price DECIMAL(12,2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    min_stock_level INTEGER,
    sku VARCHAR(50),
    barcode VARCHAR(100),
    category_id BIGINT NOT NULL,
    outlet_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    image_url VARCHAR(500),
    weight DECIMAL(10,3),
    unit VARCHAR(50),
    is_taxable BOOLEAN NOT NULL DEFAULT TRUE,
    tax_rate DECIMAL(5,2),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    version BIGINT NOT NULL DEFAULT 0,
    
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id),
    CONSTRAINT fk_products_outlet FOREIGN KEY (outlet_id) REFERENCES outlets(id),
    CONSTRAINT chk_products_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'DISCONTINUED', 'OUT_OF_STOCK', 'LOW_STOCK')),
    CONSTRAINT chk_products_price CHECK (price > 0),
    CONSTRAINT chk_products_cost_price CHECK (cost_price >= 0),
    CONSTRAINT chk_products_stock CHECK (stock_quantity >= 0),
    CONSTRAINT chk_products_min_stock CHECK (min_stock_level >= 0),
    CONSTRAINT chk_products_tax_rate CHECK (tax_rate >= 0 AND tax_rate <= 100)
);

-- Create indexes
CREATE INDEX idx_product_name ON products(name);
CREATE INDEX idx_product_category ON products(category_id);
CREATE INDEX idx_product_status ON products(status);
CREATE INDEX idx_product_created_at ON products(created_at);

-- Create unique constraints (excluding deleted)
CREATE UNIQUE INDEX idx_products_sku_unique ON products(sku) WHERE deleted = FALSE AND sku IS NOT NULL;
CREATE UNIQUE INDEX idx_products_barcode_unique ON products(barcode) WHERE deleted = FALSE AND barcode IS NOT NULL;
