IF DB_ID('public_transport_tracker') IS NULL
CREATE DATABASE public_transport_tracker;

USE public_transport_tracker;


CREATE TABLE bus (
    bus_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(20),
    license_plate VARCHAR(20),
    capacity INT,
    status VARCHAR(20),
    operator VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE route (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(100),
    start_point VARCHAR(100),
    end_point VARCHAR(100),
    distance DECIMAL(5,2),
    route_type VARCHAR(50),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE stop (
    stop_id INT AUTO_INCREMENT PRIMARY KEY,
    stop_name VARCHAR(100),
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    district VARCHAR(50),
    is_terminal BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE bus_location (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT,
    trip_id INT,
    latitude DECIMAL(10,6),
    longitude DECIMAL(10,6),
    speed DECIMAL(5,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(bus_id)
    REFERENCES bus(bus_id)
);
ALTER TABLE bus_location
ADD heading DECIMAL(6,2),
ADD accuracy DECIMAL(6,2);

CREATE TABLE route_stop (
    route_stop_id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    stop_id INT NOT NULL,
    stop_order INT NOT NULL,
    estimated_time INT,

    FOREIGN KEY (route_id) REFERENCES route(route_id),
    FOREIGN KEY (stop_id) REFERENCES stop(stop_id)
);
CREATE TABLE fare (
    fare_id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    amount DECIMAL(8,2),
    payment_method VARCHAR(50),

    FOREIGN KEY(route_id)
    REFERENCES route(route_id)
);

CREATE TABLE driver (
    driver_id INT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(100),

    phone VARCHAR(20),

    password VARCHAR(255),

    status VARCHAR(20) DEFAULT 'Active'
);

CREATE TABLE trip (
    trip_id INT AUTO_INCREMENT PRIMARY KEY,

    bus_id INT,

    driver_id INT,

    route_id INT,

    start_time DATETIME,

    end_time DATETIME,

    status VARCHAR(20),

    FOREIGN KEY(bus_id) REFERENCES bus(bus_id),

    FOREIGN KEY(driver_id) REFERENCES driver(driver_id),

    FOREIGN KEY(route_id) REFERENCES route(route_id)
);

INSERT INTO bus (bus_number, license_plate, capacity, status, operator) VALUES
('RAB-001A', 'RAD123A', 70, 'Active', 'Kigali Bus Services'),
('RAB-002B', 'RAD456B', 65, 'Active', 'Kigali Bus Services'),
('RAB-003C', 'RAD789C', 60, 'Active', 'Kigali Bus Services');

INSERT INTO route (route_name, start_point, end_point, distance, route_type, status) VALUES
('Nyabugogo - Kacyiru', 'Nyabugogo', 'Kacyiru', 8.5, 'Trunk', 'Active'),
('Nyabugogo - Remera', 'Nyabugogo', 'Remera', 10.2, 'Trunk', 'Active'),
('Kabuga - Downtown', 'Kabuga', 'Downtown', 15.3, 'Trunk', 'Active');

INSERT INTO stop (stop_name, latitude, longitude, district, is_terminal) VALUES
('Nyabugogo', -1.9441, 30.0619, 'Nyarugenge', 1),
('Kimironko', -1.9344, 30.1127, 'Gasabo', 0),
('Kacyiru', -1.9344, 30.0619, 'Gasabo', 1),
('Remera', -1.9536, 30.1127, 'Gasabo', 1),
('Kabuga', -1.9200, 30.1500, 'Gasabo', 1),
('Downtown', -1.9500, 30.0588, 'Nyarugenge', 1);

INSERT INTO route_stop (route_id, stop_id, stop_order, estimated_time) VALUES
(1, 1, 1, 0),(1, 2, 2, 15),(1, 3, 3, 30),
(2, 1, 1, 0),(2, 4, 2, 35),
(3, 5, 1, 0),(3, 6, 2, 50);

INSERT INTO fare(route_id, amount, payment_method)
VALUES
(1,500,'Tap&Go'),
(2,500,'Tap&Go'),
(3,700,'Tap&Go');
