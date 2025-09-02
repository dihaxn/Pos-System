-- Create outlets table
CREATE TABLE outlets (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    address VARCHAR(500),
    phone VARCHAR(20),
    email VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    version BIGINT NOT NULL DEFAULT 0,
    
    CONSTRAINT chk_outlets_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'CLOSED'))
);

-- Create indexes
CREATE INDEX idx_outlet_name ON outlets(name);
CREATE INDEX idx_outlet_code ON outlets(code);
CREATE INDEX idx_outlet_status ON outlets(status);
