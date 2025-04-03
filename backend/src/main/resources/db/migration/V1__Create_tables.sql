-- Create properties table
CREATE TABLE properties (
    id BIGSERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    description TEXT,
    price DOUBLE PRECISION NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    square_footage DOUBLE PRECISION NOT NULL
);

-- Create images table
CREATE TABLE images (
    id BIGSERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    content_type VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    property_id BIGINT NOT NULL REFERENCES properties(id)
); 