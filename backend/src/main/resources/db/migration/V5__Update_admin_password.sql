-- Update admin user password to 'admin' with a fresh BCrypt hash
UPDATE users 
SET password = '$2a$10$TyJfVuE4o9Q7zXOTGUYIOekQEfQFo0JyPqYCYttNhYbFnKz1N8aUK' 
WHERE username = 'admin'; 