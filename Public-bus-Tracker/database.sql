CREATE DATABASE IF NOT EXISTS public_transport_tracker;

USE public_transport_tracker;

DROP TABLE IF EXISTS notifications;
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
    phone VARCHAR(20) UNIQUE,
    role ENUM('Admin','Passenger') NOT NULL DEFAULT 'Passenger',
    status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bus (
    bus_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(20) NOT NULL UNIQUE,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    status ENUM('Active','Inactive','Maintenance') NOT NULL DEFAULT 'Active',
    operator VARCHAR(100) NOT NULL DEFAULT 'Kigali Bus Services',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE route (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(150) NOT NULL UNIQUE,
    start_point VARCHAR(100) NOT NULL,
    end_point VARCHAR(100) NOT NULL,
    distance DECIMAL(6,2) NOT NULL,
    route_type ENUM('Trunk','Zonal') NOT NULL DEFAULT 'Trunk',
    status ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE stop (
    stop_id INT AUTO_INCREMENT PRIMARY KEY,
    stop_name VARCHAR(100) NOT NULL UNIQUE,
    latitude DECIMAL(10,6) NOT NULL,
    longitude DECIMAL(10,6) NOT NULL,
    district VARCHAR(50),
    is_terminal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE route_stop (
    route_stop_id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    stop_id INT NOT NULL,
    stop_order INT NOT NULL,
    estimated_time INT DEFAULT 0,
    FOREIGN KEY (route_id) REFERENCES route(route_id) ON DELETE CASCADE,
    FOREIGN KEY (stop_id) REFERENCES stop(stop_id) ON DELETE CASCADE,
    UNIQUE (route_id, stop_order)
);

CREATE TABLE trip (
    trip_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    route_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    status ENUM('Scheduled','Ongoing','Completed','Cancelled') NOT NULL DEFAULT 'Scheduled',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES bus(bus_id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES route(route_id) ON DELETE CASCADE
);

CREATE TABLE bus_location (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    trip_id INT,
    latitude DECIMAL(10,6) NOT NULL,
    longitude DECIMAL(10,6) NOT NULL,
    speed DECIMAL(5,2) DEFAULT 0.00,
    recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES bus(bus_id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trip(trip_id) ON DELETE SET NULL
);

CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('Delay','Cancellation','Arrival','RouteChange','General') NOT NULL DEFAULT 'General',
    status ENUM('Unread','Read') NOT NULL DEFAULT 'Unread',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

INSERT INTO users (full_name, email, password, phone, role, status) VALUES
('Admin KBS', 'admin@kbs.rw', 'hashed_admin123', '+250788000001', 'Admin', 'Active'),
('Alice Uwimana', 'alice@gmail.com', 'hashed_pass001', '+250788000002', 'Passenger', 'Active'),
('Bob Niyomugabo', 'bob@gmail.com', 'hashed_pass002', '+250788000003', 'Passenger', 'Active'),
('Claire Mukamana', 'claire@gmail.com', 'hashed_pass003', '+250788000004', 'Passenger', 'Active'),
('David Habimana', 'david@gmail.com', 'hashed_pass004', '+250788000005', 'Passenger', 'Active');

INSERT INTO bus (bus_number, license_plate, capacity, status, operator) VALUES
('KBS-001', 'RAC 001A', 55, 'Active', 'Kigali Bus Services'),
('KBS-002', 'RAC 002B', 55, 'Active', 'Kigali Bus Services'),
('KBS-003', 'RAC 003C', 45, 'Active', 'Kigali Bus Services'),
('KBS-004', 'RAC 004D', 45, 'Maintenance', 'Kigali Bus Services'),
('KBS-005', 'RAC 005E', 55, 'Active', 'Kigali Bus Services'),
('KBS-006', 'RAC 006F', 30, 'Active', 'Kigali Bus Services'),
('KBS-007', 'RAC 007G', 30, 'Inactive', 'Kigali Bus Services');

INSERT INTO route (route_name, start_point, end_point, distance, route_type, status) VALUES
('Kabuga - Nyabugogo via Sonatube', 'Kabuga', 'Nyabugogo', 22.50, 'Trunk', 'Active'),
('Rubirizi - Downtown', 'Rubirizi', 'Downtown', 12.00, 'Trunk', 'Active'),
('Kibaya - Kanombe Airport - Downtown', 'Kibaya', 'Downtown', 18.00, 'Trunk', 'Active'),
('Remera - Nyabugogo', 'Remera', 'Nyabugogo', 10.50, 'Trunk', 'Active'),
('Masaka - Remera', 'Masaka', 'Remera', 14.00, 'Zonal', 'Active'),
('Nyanza - Kicukiro - Remera', 'Nyanza', 'Remera', 16.00, 'Zonal', 'Active'),
('Remera - Kimihurura - Downtown', 'Remera', 'Downtown', 8.00, 'Zonal', 'Active'),
('Kibaya - Kacyiru - Nyabugogo', 'Kibaya', 'Nyabugogo', 20.00, 'Zonal', 'Active');

INSERT INTO stop (stop_name, latitude, longitude, district, is_terminal) VALUES
('Nyabugogo Terminal', -1.940630, 30.044580, 'Nyarugenge', TRUE),
('Remera Bus Park', -1.958844, 30.119379, 'Gasabo', TRUE),
('Kimironko Station', -1.949474, 30.125295, 'Gasabo', TRUE),
('Kacyiru Bus Park', -1.936570, 30.080980, 'Gasabo', FALSE),
('Kicukiro Centre', -1.982072, 30.103920, 'Kicukiro', FALSE),
('Kanombe Airport', -1.963312, 30.135018, 'Kicukiro', FALSE),
('Kabuga Bus Park', -1.979177, 30.223129, 'Gasabo', TRUE),
('Downtown Kigali', -1.946942, 30.059748, 'Nyarugenge', FALSE),
('Sonatube', -1.960000, 30.073000, 'Nyarugenge', FALSE),
('Kimihurura', -1.944000, 30.090000, 'Gasabo', FALSE),
('Masaka', -2.012000, 30.080000, 'Kicukiro', FALSE),
('Nyanza', -2.349000, 29.739000, 'Huye', TRUE),
('Rubirizi', -1.978000, 30.050000, 'Nyarugenge', FALSE),
('Kibaya', -1.970000, 30.148000, 'Kicukiro', FALSE),
('Chez Lando', -1.952000, 30.095000, 'Gasabo', FALSE),
('Gishushu', -1.953780, 30.102310, 'Gasabo', FALSE),
('Nyamirambo', -1.964960, 30.062880, 'Nyarugenge', FALSE),
('Gikondo', -1.982950, 30.075050, 'Kicukiro', FALSE),
('Muhima', -1.955000, 30.058000, 'Nyarugenge', FALSE),
('Biryogo', -1.965140, 30.060120, 'Nyarugenge', FALSE),
('Kibagabaga', -1.932000, 30.120000, 'Gasabo', FALSE),
('Ndera', -1.920000, 30.145000, 'Gasabo', FALSE),
('UTC Downtown', -1.949200, 30.059000, 'Nyarugenge', FALSE),
('Kigali Heights', -1.939000, 30.087000, 'Gasabo', FALSE),
('Kagugu', -1.928000, 30.097000, 'Gasabo', FALSE),
('Giporoso', -1.952000, 30.110000, 'Gasabo', FALSE),
('Gatenga', -1.993000, 30.095000, 'Kicukiro', FALSE),
('Kagarama', -1.989000, 30.088000, 'Kicukiro', FALSE),
('Rwandex', -1.957000, 30.068000, 'Nyarugenge', FALSE),
('Nyabugogo Market', -1.942000, 30.046000, 'Nyarugenge', FALSE),
('Kibovu', -1.945000, 30.073000, 'Nyarugenge', FALSE),
('Gatsata', -1.930000, 30.060000, 'Gasabo', FALSE),
('Kinyinya', -1.915000, 30.108000, 'Gasabo', FALSE),
('Zindiro', -1.910000, 30.130000, 'Gasabo', FALSE),
('Jabana', -1.905000, 30.118000, 'Gasabo', FALSE);

INSERT INTO route_stop (route_id, stop_id, stop_order, estimated_time) VALUES
(1,7,1,0),(1,9,2,25),(1,8,3,15),(1,1,4,10),
(2,13,1,0),(2,8,2,20),(2,1,3,10),
(3,14,1,0),(3,6,2,15),(3,2,3,20),(3,8,4,15),
(4,2,1,0),(4,10,2,10),(4,4,3,10),(4,1,4,15),
(5,11,1,0),(5,5,2,10),(5,2,3,20),
(6,12,1,0),(6,5,2,45),(6,2,3,20),
(7,2,1,0),(7,15,2,8),(7,10,3,7),(7,8,4,10),
(8,14,1,0),(8,15,2,10),(8,4,3,10),(8,1,4,15);

INSERT INTO trip (bus_id, route_id, start_time, end_time, status) VALUES
(1,1,'2026-07-13 06:30:00','2026-07-13 07:30:00','Completed'),
(2,4,'2026-07-13 07:00:00','2026-07-13 07:45:00','Completed'),
(3,3,'2026-07-13 07:30:00',NULL,'Ongoing'),
(5,2,'2026-07-13 08:00:00',NULL,'Ongoing'),
(6,7,'2026-07-13 09:00:00',NULL,'Scheduled'),
(1,1,'2026-07-13 09:30:00',NULL,'Scheduled'),
(2,8,'2026-07-13 10:00:00',NULL,'Scheduled');

INSERT INTO bus_location (bus_id, trip_id, latitude, longitude, speed, recorded_at) VALUES
(3,3,-1.970000,30.148000,0.00,'2026-07-13 07:30:00'),
(3,3,-1.967000,30.143000,35.00,'2026-07-13 07:35:00'),
(3,3,-1.965000,30.139000,38.00,'2026-07-13 07:40:00'),
(3,3,-1.963312,30.135018,0.00,'2026-07-13 07:45:00'),
(3,3,-1.961000,30.130000,30.00,'2026-07-13 07:52:00'),
(3,3,-1.958844,30.119379,0.00,'2026-07-13 08:05:00'),
(5,4,-1.978000,30.050000,0.00,'2026-07-13 08:00:00'),
(5,4,-1.970000,30.052000,40.00,'2026-07-13 08:05:00'),
(5,4,-1.962000,30.055000,38.00,'2026-07-13 08:10:00'),
(5,4,-1.955000,30.057000,35.00,'2026-07-13 08:15:00'),
(5,4,-1.949000,30.059000,30.00,'2026-07-13 08:20:00'),
(1,1,-1.979177,30.223129,0.00,'2026-07-13 06:30:00'),
(1,1,-1.975000,30.200000,42.00,'2026-07-13 06:38:00'),
(1,1,-1.960000,30.073000,0.00,'2026-07-13 06:55:00'),
(1,1,-1.946942,30.059748,0.00,'2026-07-13 07:18:00'),
(1,1,-1.940630,30.044580,0.00,'2026-07-13 07:30:00');

INSERT INTO notifications (user_id, title, message, type, status) VALUES
(2,'Bus Delayed','KBS-003 on Kibaya-Downtown is delayed 10 minutes due to traffic at Remera.','Delay','Unread'),
(3,'Bus Arriving Soon','KBS-005 is arriving at Downtown Kigali in approximately 5 minutes.','Arrival','Unread'),
(4,'Route Change','Masaka-Remera has a temporary diversion via Kicukiro Centre today.','RouteChange','Read'),
(5,'Service Update','KBS-004 is under maintenance. Please use KBS-001 as an alternative.','General','Read'),
(2,'Trip Cancelled','The 09:00 trip on Remera-Kimihurura-Downtown has been cancelled.','Cancellation','Unread');
