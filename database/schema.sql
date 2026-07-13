-- ==========================================
-- Smart Public Transport Tracker Database
-- Schema Creation Script
-- ==========================================

CREATE DATABASE IF NOT EXISTS smart_transport_tracker;

USE smart_transport_tracker;

-- ===========================
-- USERS TABLE
-- ===========================

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin','Passenger') NOT NULL
);

-- ===========================
-- BUS TABLE
-- ===========================

CREATE TABLE IF NOT EXISTS bus (
    bus_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(20) NOT NULL,
    license_plate VARCHAR(20) NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(20)
);

-- ===========================
-- ROUTE TABLE
-- ===========================

CREATE TABLE IF NOT EXISTS route (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(100) NOT NULL,
    start_point VARCHAR(100),
    end_point VARCHAR(100),
    distance DECIMAL(6,2)
);

-- ===========================
-- STOP TABLE
-- ===========================

CREATE TABLE IF NOT EXISTS stop (
    stop_id INT AUTO_INCREMENT PRIMARY KEY,
    stop_name VARCHAR(100),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6)
);

-- ===========================
-- ROUTE_STOP TABLE
-- ===========================

CREATE TABLE IF NOT EXISTS route_stop (
    route_stop_id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT,
    stop_id INT,
    stop_order INT,
    estimated_time INT,

    FOREIGN KEY (route_id)
        REFERENCES route(route_id),

    FOREIGN KEY (stop_id)
        REFERENCES stop(stop_id)
);

-- ===========================
-- TRIP TABLE
-- ===========================

CREATE TABLE IF NOT EXISTS trip (
    trip_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT,
    route_id INT,
    start_time DATETIME,
    end_time DATETIME,
    status VARCHAR(30),

    FOREIGN KEY (bus_id)
        REFERENCES bus(bus_id),

    FOREIGN KEY (route_id)
        REFERENCES route(route_id)
);

-- ===========================
-- BUS LOCATION TABLE
-- ===========================

CREATE TABLE IF NOT EXISTS bus_location (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    recorded_at DATETIME,

    FOREIGN KEY (bus_id)
        REFERENCES bus(bus_id)
);