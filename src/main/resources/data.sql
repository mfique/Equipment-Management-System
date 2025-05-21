-- Drop existing data
DELETE FROM users;

-- Insert users with properly hashed passwords
-- Password for all users is 'password123'
INSERT INTO users (name, email, password, role) VALUES 
('Test User', 'testuser@example.com', '$2a$10$ixjmqehKEioVVzXgrDzkz.W0F6RA.zT2z9gcnasaiuhnCaFBeHuLG', 'STAFF'),
('Admin', 'admin@example.com', '$2a$10$ixjmqehKEioVVzXgrDzkz.W0F6RA.zT2z9gcnasaiuhnCaFBeHuLG', 'ADMIN'),
('Staff User', 'staff@example.com', '$2a$10$ixjmqehKEioVVzXgrDzkz.W0F6RA.zT2z9gcnasaiuhnCaFBeHuLG', 'STAFF'),
('Test User', 'test@example.com', '$2a$10$ixjmqehKEioVVzXgrDzkz.W0F6RA.zT2z9gcnasaiuhnCaFBeHuLG', 'STAFF'); 