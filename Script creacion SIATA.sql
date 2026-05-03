-- =========================
-- EXTENSION FOR UUID
-- =========================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- TIMEZONE CONFIG
-- =========================
SET TIME ZONE 'America/Bogota';

-- =========================
-- BASE TABLES
-- =========================

CREATE TABLE client (
    id SERIAL PRIMARY KEY,
    mask_uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    mask_uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE warehouse (
    id SERIAL PRIMARY KEY,
    mask_uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    name VARCHAR(100) NOT NULL,
    location VARCHAR(150),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE port (
    id SERIAL PRIMARY KEY,
    mask_uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    name VARCHAR(100) NOT NULL,
    location VARCHAR(150),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE
);


-- =========================
-- SHIPMENT (BASE)
-- =========================

CREATE TABLE shipment (
    id SERIAL PRIMARY KEY,
    mask_uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    type VARCHAR(20) NOT NULL CHECK (type IN ('land', 'sea')),
    client_id INT NOT NULL,
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    delivery_date DATE NOT NULL,
    base_price NUMERIC(10,2) NOT NULL,
    discount_percent NUMERIC(5,2) DEFAULT 0,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    total_price NUMERIC(10,2) NOT NULL,

    guide_number VARCHAR(10) UNIQUE NOT NULL,
    CHECK (guide_number ~ '^[A-Za-z0-9]{10}$'),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE,

    FOREIGN KEY (client_id) REFERENCES client(id)
);


-- =========================
-- SHIPMENT_ITEM 
-- =========================

CREATE TABLE shipment_item (
    id SERIAL PRIMARY KEY,
    mask_uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    shipment_id INT NOT NULL,
    product_id INT NOT NULL,

    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE,

    FOREIGN KEY (shipment_id) REFERENCES shipment(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id)
);


-- =========================
-- LAND SHIPMENT
-- =========================

CREATE TABLE land_shipment (
    shipment_id INT PRIMARY KEY,
    mask_uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    
    warehouse_id INT NOT NULL,
    vehicle_plate VARCHAR(6) NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE,

    FOREIGN KEY (shipment_id) REFERENCES shipment(id) ON DELETE CASCADE,
    FOREIGN KEY (warehouse_id) REFERENCES warehouse(id),

    CHECK (vehicle_plate ~ '^[A-Z]{3}[0-9]{3}$')
);

-- =========================
-- SEA SHIPMENT
-- =========================

CREATE TABLE sea_shipment (
    shipment_id INT PRIMARY KEY,
    mask_uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,

    port_id INT NOT NULL,
    fleet_number VARCHAR(8) NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE,

    FOREIGN KEY (shipment_id) REFERENCES shipment(id) ON DELETE CASCADE,
    FOREIGN KEY (port_id) REFERENCES port(id),

    CHECK (fleet_number ~ '^[A-Z]{3}[0-9]{4}[A-Z]$')
);

-- =========================
-- User
-- =========================


CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    mask_uuid UUID NOT NULL DEFAULT uuid_generate_v4() UNIQUE,
    
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_shipment_client ON shipment(client_id);
CREATE INDEX idx_shipment_type ON shipment(type);
CREATE INDEX idx_shipment_item_shipment ON shipment_item(shipment_id);
CREATE INDEX idx_shipment_item_product ON shipment_item(product_id);
CREATE INDEX idx_shipment_registration_date ON shipment(registration_date);


