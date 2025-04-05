-- Add role column to users table
ALTER TABLE users ADD COLUMN role VARCHAR(50);

-- Update existing users: set admin role for is_admin=true, user role for is_admin=false
UPDATE users SET role = 'ROLE_ADMIN' WHERE is_admin = true;
UPDATE users SET role = 'ROLE_USER' WHERE is_admin = false;

-- Make role column not null after data migration
ALTER TABLE users ALTER COLUMN role SET NOT NULL;

-- Drop is_admin column as it's now replaced by role
ALTER TABLE users DROP COLUMN is_admin; 