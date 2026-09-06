CREATE TABLE procurement_centers (
    id SERIAL PRIMARY KEY,

    name VARCHAR(150),
    location VARCHAR(255),
    district VARCHAR(100),
    state VARCHAR(100),
    contact_number VARCHAR(15),

    status VARCHAR(20) NOT NULL DEFAULT 'active',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
