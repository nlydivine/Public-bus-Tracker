-- ==========================================
-- Views Script
-- ==========================================
USE public_transport_tracker;

CREATE OR REPLACE VIEW active_buses AS
SELECT bus_id, bus_number, license_plate, capacity, operator
FROM bus WHERE status = 'Active';

CREATE OR REPLACE VIEW current_bus_locations AS
SELECT b.bus_id, b.bus_number, b.status,
       bl.latitude, bl.longitude, bl.speed, bl.recorded_at, r.route_name
FROM bus b
JOIN bus_location bl ON b.bus_id = bl.bus_id
LEFT JOIN trip t ON bl.trip_id = t.trip_id
LEFT JOIN route r ON t.route_id = r.route_id
WHERE bl.recorded_at = (
    SELECT MAX(bl2.recorded_at) FROM bus_location bl2 WHERE bl2.bus_id = b.bus_id
);

CREATE OR REPLACE VIEW available_routes AS
SELECT r.route_id, r.route_name, r.start_point, r.end_point,
       r.distance, r.route_type, COUNT(rs.stop_id) AS total_stops
FROM route r
LEFT JOIN route_stop rs ON r.route_id = rs.route_id
WHERE r.status = 'Active'
GROUP BY r.route_id, r.route_name, r.start_point, r.end_point, r.distance, r.route_type;

CREATE OR REPLACE VIEW ongoing_trips AS
SELECT t.trip_id, b.bus_number, b.license_plate,
       r.route_name, r.start_point, r.end_point, t.start_time
FROM trip t
JOIN bus b ON t.bus_id = b.bus_id
JOIN route r ON t.route_id = r.route_id
WHERE t.status = 'Ongoing';

CREATE OR REPLACE VIEW unread_notifications AS
SELECT n.notification_id, u.full_name, u.email,
       n.title, n.message, n.type, n.created_at
FROM notifications n
JOIN users u ON n.user_id = u.user_id
WHERE n.status = 'Unread'
ORDER BY n.created_at DESC;