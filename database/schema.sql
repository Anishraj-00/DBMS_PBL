-- =====================================================================
-- RESTAURANT TABLE OCCUPANCY MANAGEMENT SYSTEM
-- Relational Database Schema (MySQL 8.x / 26.x)
-- Course: DBMS Project-Based Learning (PBL)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS restaurant_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE restaurant_db;

-- ---------------------------------------------------------------------
-- 1. Table: users (Staff / Admin authentication & role-based access)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS table_status_logs;
DROP TABLE IF EXISTS occupancy_sessions;
DROP TABLE IF EXISTS restaurant_tables;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('ADMIN', 'WAITER', 'MANAGER') NOT NULL DEFAULT 'WAITER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 2. Table: restaurant_tables (Physical restaurant tables)
-- ---------------------------------------------------------------------
CREATE TABLE restaurant_tables (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_number VARCHAR(20) NOT NULL UNIQUE,
    capacity INT NOT NULL CHECK (capacity > 0),
    location_zone ENUM('MAIN_HALL', 'PATIO', 'BALCONY', 'VIP') NOT NULL DEFAULT 'MAIN_HALL',
    status ENUM('AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING') NOT NULL DEFAULT 'AVAILABLE',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status_capacity (status, capacity),
    INDEX idx_zone (location_zone)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 3. Table: customers (Customer master registry)
-- ---------------------------------------------------------------------
CREATE TABLE customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customer_phone (phone_number)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 4. Table: occupancy_sessions (Check-in to Checkout lifecycle)
-- ---------------------------------------------------------------------
CREATE TABLE occupancy_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    party_size INT NOT NULL CHECK (party_size > 0),
    status ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    allocation_type ENUM('MANUAL', 'AUTOMATIC') NOT NULL DEFAULT 'MANUAL',
    check_in_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_out_time TIMESTAMP NULL,
    dining_duration_minutes INT NULL,
    staff_id BIGINT NULL,
    notes VARCHAR(255) NULL,
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(id) ON DELETE RESTRICT,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE RESTRICT,
    FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_active_sessions (table_id, status),
    INDEX idx_checkin_time (check_in_time)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 5. Table: table_status_logs (Audit trail for table status transitions)
-- ---------------------------------------------------------------------
CREATE TABLE table_status_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_id BIGINT NOT NULL,
    previous_status ENUM('AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING') NOT NULL,
    new_status ENUM('AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING') NOT NULL,
    reason VARCHAR(255) NULL,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(id) ON DELETE CASCADE,
    INDEX idx_table_history (table_id, changed_at)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- 6. DBMS Trigger: Auto-log table status changes to table_status_logs
-- ---------------------------------------------------------------------
DELIMITER $$
CREATE TRIGGER trg_table_status_audit
AFTER UPDATE ON restaurant_tables
FOR EACH ROW
BEGIN
    IF OLD.status <> NEW.status THEN
        INSERT INTO table_status_logs (table_id, previous_status, new_status, reason, changed_at)
        VALUES (OLD.id, OLD.status, NEW.status, 'Automated Trigger: Status transitioned', NOW());
    END IF;
END$$
DELIMITER ;

