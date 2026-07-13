USE smart_transport_tracker;

-- Show all buses

SELECT * FROM bus;

-- Show all routes

SELECT * FROM route;

-- Show all trips

SELECT * FROM trip;

-- Active buses

SELECT *
FROM bus
WHERE status='Active';

-- Trips with Bus and Route

SELECT
    b.bus_number,
    r.route_name,
    t.status
FROM trip t
JOIN bus b
ON t.bus_id=b.bus_id
JOIN route r
ON t.route_id=r.route_id;

-- Count buses

SELECT COUNT(*) AS total_buses
FROM bus;

-- Count routes

SELECT COUNT(*) AS total_routes
FROM route;

-- List stops for each route

SELECT
    r.route_name,
    s.stop_name,
    rs.stop_order
FROM route_stop rs
JOIN route r
ON rs.route_id=r.route_id
JOIN stop s
ON rs.stop_id=s.stop_id
ORDER BY rs.stop_order;

-- Insert Data

INSERT INTO bus(bus_number,license_plate,capacity,status)
VALUES
('RAB-003C','RAD789C',60,'Active');

-- Update Data

UPDATE bus
SET status='Maintenance'
WHERE bus_id=3;

-- Restore Data

UPDATE bus
SET status='Active'
WHERE bus_id=3;

-- Delete Data

DELETE FROM bus
WHERE bus_id=3;

-- Search Data

SELECT *
FROM bus
WHERE capacity >= 65;

-- Join

SELECT
    b.bus_number,
    r.route_name,
    t.status
FROM trip t
JOIN bus b
ON t.bus_id=b.bus_id
JOIN route r
ON t.route_id=r.route_id;