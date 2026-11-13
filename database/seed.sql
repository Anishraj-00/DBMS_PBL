-- =====================================================================
-- RESTAURANT TABLE OCCUPANCY MANAGEMENT SYSTEM
-- Initial Seed Data
-- =====================================================================

USE restaurant_db;

-- 1. Insert Default Users (Admin & Waiters)
INSERT INTO users (username, password_hash, full_name, role) VALUES
('admin', 'admin123', 'Restaurant Admin', 'ADMIN'),
('waiter1', 'waiter123', 'John Doe (Server)', 'WAITER'),
('waiter2', 'waiter123', 'Jane Smith (Server)', 'WAITER');

-- 2. Insert Restaurant Tables (Varying capacities and zones)
INSERT INTO restaurant_tables (table_number, capacity, location_zone, status) VALUES
-- Main Hall
('T-01', 2, 'MAIN_HALL', 'AVAILABLE'),
('T-02', 2, 'MAIN_HALL', 'AVAILABLE'),
('T-03', 4, 'MAIN_HALL', 'AVAILABLE'),
('T-04', 4, 'MAIN_HALL', 'AVAILABLE'),
('T-05', 6, 'MAIN_HALL', 'AVAILABLE'),
('T-06', 8, 'MAIN_HALL', 'AVAILABLE'),

-- Patio / Outdoor
('P-01', 2, 'PATIO', 'AVAILABLE'),
('P-02', 4, 'PATIO', 'AVAILABLE'),
('P-03', 4, 'PATIO', 'AVAILABLE'),

-- Balcony
('B-01', 2, 'BALCONY', 'AVAILABLE'),
('B-02', 4, 'BALCONY', 'AVAILABLE'),

-- VIP Lounge
('VIP-01', 6, 'VIP', 'AVAILABLE'),
('VIP-02', 10, 'VIP', 'AVAILABLE');

-- 3. Insert Initial Customers
INSERT INTO customers (full_name, phone_number, notes) VALUES
('Rahul Sharma', '+91 9876543210', 'Prefers quiet corner tables'),
('Priya Patel', '+91 9812345678', 'Vegetarian, anniversary celebration'),
('Amit Verma', '+91 9988776655', 'Regular patron - business lunches'),
('Sneha Reddy', '+91 9765432109', 'Family with children');

-- 4. Insert Some Completed Historical Sessions for Analytics demonstration
INSERT INTO occupancy_sessions 
(table_id, customer_id, party_size, status, allocation_type, check_in_time, check_out_time, dining_duration_minutes, staff_id, notes) 
VALUES
(1, 1, 2, 'COMPLETED', 'MANUAL', DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR), 60, 2, 'Quick lunch'),
(3, 2, 4, 'COMPLETED', 'AUTOMATIC', DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR + INTERVAL 30 MINUTE), 90, 2, 'Birthday dinner'),
(5, 3, 5, 'COMPLETED', 'AUTOMATIC', DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR + INTERVAL 45 MINUTE), 75, 3, 'Client meeting');

-- 5. Seed some initial table status logs corresponding to historical sessions
INSERT INTO table_status_logs (table_id, previous_status, new_status, reason, changed_at) VALUES
(1, 'AVAILABLE', 'OCCUPIED', 'Customer check-in', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(1, 'OCCUPIED', 'CLEANING', 'Customer checkout', DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(1, 'CLEANING', 'AVAILABLE', 'Table sanitized', DATE_SUB(NOW(), INTERVAL 1 HOUR + INTERVAL 45 MINUTE)),
(3, 'AVAILABLE', 'OCCUPIED', 'Customer check-in', DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(3, 'OCCUPIED', 'CLEANING', 'Customer checkout', DATE_SUB(NOW(), INTERVAL 2 HOUR + INTERVAL 30 MINUTE)),
(3, 'CLEANING', 'AVAILABLE', 'Table sanitized', DATE_SUB(NOW(), INTERVAL 2 HOUR + INTERVAL 15 MINUTE));

