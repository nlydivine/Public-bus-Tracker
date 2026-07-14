-- ==========================================
-- Smart Public Transport Tracker Database
-- Schema Creation Script (Upgraded)
-- Kigali, Rwanda
-- ==========================================
CREATE DATABASE IF NOT EXISTS smart_transport_tracker;
USE smart_transport_tracker;

CREATE TABLE IF NOT EXISTS users (
    user_id    INT AUTO_INCREMENT PRIMARY KEY,
    full_name  VARCHAR(100) NOT NULL,
    email      VARCHAR(100) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    phone      VARCHAR(20)  UNIQUE,
    role       ENUM('Admin','Passenger') NOT NULL DEFAULT 'Passenger',
    status     ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bus (
    bus_id        INT AUTO_INCREMENT PRIMARY KEY,
    bus_number    VARCHAR(20) NOT NULL UNIQUE,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    capacity      INT NOT NULL CHECK (capacity > 0),
    status        ENUM('Active','Inactive','Maintenance') NOT NULL DEFAULT 'Active',
    operator      VARCHAR(100) NOT NULL DEFAULT 'Kigali Bus Services',
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS route (
    route_id    INT AUTO_INCREMENT PRIMARY KEY,
    route_name  VARCHAR(150) NOT NULL UNIQUE,
    start_point VARCHAR(100) NOT NULL,
    end_point   VARCHAR(100) NOT NULL,
    distance    DECIMAL(6,2) CHECK (distance > 0),
    route_type  ENUM('Trunk','Zonal') NOT NULL DEFAULT 'Trunk',
    status      ENUM('Active','Inactive') NOT NULL DEFAULT 'Active',
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stop (
    stop_id     INT AUTO_INCREMENT PRIMARY KEY,
    stop_name   VARCHAR(100) NOT NULL UNIQUE,
    latitude    DECIMAL(10,6) NOT NULL,
    longitude   DECIMAL(10,6) NOT NULL,
    district    VARCHAR(50),
    is_terminal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS route_stop (
    route_stop_id  INT AUTO_INCREMENT PRIMARY KEY,
    route_id       INT NOT NULL,
    stop_id        INT NOT NULL,
    stop_order     INT NOT NULL CHECK (stop_order > 0),
    estimated_time INT CHECK (estimated_time >= 0),
    FOREIGN KEY (route_id) REFERENCES route(route_id) ON DELETE CASCADE,
    FOREIGN KEY (stop_id)  REFERENCES stop(stop_id)  ON DELETE CASCADE,
    UNIQUE (route_id, stop_order)
);

CREATE TABLE IF NOT EXISTS trip (
    trip_id    INT AUTO_INCREMENT PRIMARY KEY,
    bus_id     INT NOT NULL,
    route_id   INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time   DATETIME,
    status     ENUM('Scheduled','Ongoing','Completed','Cancelled') NOT NULL DEFAULT 'Scheduled',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id)   REFERENCES bus(bus_id)   ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES route(route_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bus_location (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id      INT NOT NULL,
    trip_id     INT,
    latitude    DECIMAL(10,6) NOT NULL,
    longitude   DECIMAL(10,6) NOT NULL,
    speed       DECIMAL(5,2)  DEFAULT 0.00,
    recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id)  REFERENCES bus(bus_id)  ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trip(trip_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    title           VARCHAR(150) NOT NULL,
    message         TEXT NOT NULL,
    type            ENUM('Delay','Cancellation','Arrival','RouteChange','General') NOT NULL DEFAULT 'General',
    status          ENUM('Unread','Read') NOT NULL DEFAULT 'Unread',
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);