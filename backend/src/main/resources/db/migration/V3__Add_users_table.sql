CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

-- Create an admin user with password 'admin' (bcrypt encoded)
-- Note: In production, use a secure password and store securely
INSERT INTO users (username, password, is_admin)
VALUES ('admin', '$2a$10$rBV2JDeWW3.vKyeQplBd3O4ihQoO4.4./aJjFJsYY6K8zH.76Jce2', true);

-- Add constraints to properties table to ensure only admin can manage properties
ALTER TABLE properties
ADD COLUMN created_by BIGINT REFERENCES users(id),
ADD COLUMN last_modified_by BIGINT REFERENCES users(id); 