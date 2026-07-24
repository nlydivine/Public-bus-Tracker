CREATE DATABASE IF NOT EXISTS public_transport_tracker;

USE public_transport_tracker;

DROP TABLE IF EXISTS bus_location;
DROP TABLE IF EXISTS route_stop;
DROP TABLE IF EXISTS trip;
DROP TABLE IF EXISTS stop;
DROP TABLE IF EXISTS route;
DROP TABLE IF EXISTS bus;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Passenger') NOT NULL DEFAULT 'Passenger',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bus (
    bus_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(20) NOT NULL,
    license_plate VARCHAR(20) NOT NULL,
    capacity INT NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    operator VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE route (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(100) NOT NULL,
    start_point VARCHAR(100),
    end_point VARCHAR(100),
    distance DECIMAL(6,2) NOT NULL DEFAULT 0,
    route_type VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stop (
    stop_id INT AUTO_INCREMENT PRIMARY KEY,
    stop_name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    district VARCHAR(50),
    is_terminal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE route_stop (
    route_stop_id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    stop_id INT NOT NULL,
    stop_order INT NOT NULL,
    estimated_time INT DEFAULT 0,
    FOREIGN KEY (route_id) REFERENCES route(route_id) ON DELETE CASCADE,
    FOREIGN KEY (stop_id) REFERENCES stop(stop_id) ON DELETE CASCADE
);

CREATE TABLE trip (
    trip_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT,
    route_id INT,
    start_time DATETIME,
    end_time DATETIME,
    status VARCHAR(30) DEFAULT 'Scheduled',
    FOREIGN KEY (bus_id) REFERENCES bus(bus_id) ON DELETE SET NULL,
    FOREIGN KEY (route_id) REFERENCES route(route_id) ON DELETE SET NULL
);

CREATE TABLE bus_location (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    trip_id INT,
    latitude DECIMAL(10,6) NOT NULL,
    longitude DECIMAL(10,6) NOT NULL,
    speed DECIMAL(5,2) DEFAULT 0,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES bus(bus_id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trip(trip_id) ON DELETE SET NULL
);

INSERT INTO users (full_name, email, password, role) VALUES
('John Doe', 'john@example.com', 'password123', 'Passenger'),
('Alice Admin', 'alice@example.com', 'admin123', 'Admin');

INSERT INTO bus (bus_number, license_plate, capacity, status, operator) VALUES
('RAB-001A', 'RAD123A', 70, 'Active', 'Kigali Bus Services'),
('RAB-002B', 'RAD456B', 65, 'Active', 'Kigali Bus Services'),
('RAB-003C', 'RAD789C', 60, 'Active', 'Kigali Bus Services');

INSERT INTO route (route_name, start_point, end_point, distance, route_type, status) VALUES
('Nyabugogo - Kacyiru', 'Nyabugogo', 'Kacyiru', 8.5, 'Trunk', 'Active'),
('Nyabugogo - Remera', 'Nyabugogo', 'Remera', 10.2, 'Trunk', 'Active'),
('Kabuga - Downtown', 'Kabuga', 'Downtown', 15.3, 'Trunk', 'Active');

INSERT INTO stop (stop_name, latitude, longitude, district, is_terminal) VALUES
('Nyabugogo', -1.944100, 30.061900, 'Nyarugenge', TRUE),
('Kimironko', -1.934400, 30.112700, 'Gasabo', FALSE),
('Kacyiru', -1.934400, 30.061900, 'Gasabo', TRUE),
('Remera', -1.953600, 30.112700, 'Gasabo', TRUE),
('Kabuga', -1.920000, 30.150000, 'Gasabo', TRUE),
('Downtown', -1.950000, 30.058800, 'Nyarugenge', TRUE);

INSERT INTO route_stop (route_id, stop_id, stop_order, estimated_time) VALUES
(1, 1, 1, 0),
(1, 2, 2, 15),
(1, 3, 3, 30),
(2, 1, 1, 0),
(2, 4, 2, 35),
(3, 5, 1, 0),
(3, 6, 2, 50);

INSERT INTO trip (bus_id, route_id, start_time, end_time, status) VALUES
(1, 1, NOW(), NULL, 'In Progress'),
(2, 2, NOW(), NULL, 'In Progress');

INSERT INTO bus_location (bus_id, trip_id, latitude, longitude, speed) VALUES
(1, 1, -1.942500, 30.062100, 30),
(2, 2, -1.950000, 30.090000, 28);
