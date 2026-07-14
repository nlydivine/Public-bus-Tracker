-- ==========================================
-- Queries Script
-- ==========================================
USE smart_transport_tracker;

-- 1. Get all active buses
SELECT bus_id, bus_number, license_plate, capacity, status, operator
FROM bus WHERE status = 'Active';

-- 2. Get all active routes
SELECT route_id, route_name, start_point, end_point, distance, route_type
FROM route WHERE status = 'Active' ORDER BY route_type, route_name;

-- 3. Get all stops on a specific route
SELECT s.stop_name, s.latitude, s.longitude, s.district,
       rs.stop_order, rs.estimated_time
FROM stop s
JOIN route_stop rs ON s.stop_id = rs.stop_id
JOIN route r ON rs.route_id = r.route_id
WHERE r.route_name = 'Kabuga - Nyabugogo via Sonatube'
ORDER BY rs.stop_order;

-- 4. Route search — find routes passing through a stop
SELECT DISTINCT r.route_id, r.route_name, r.start_point, r.end_point, r.route_type
FROM route r
JOIN route_stop rs ON r.route_id = rs.route_id
JOIN stop s ON rs.stop_id = s.stop_id
WHERE s.stop_name LIKE '%Remera%' AND r.status = 'Active';

-- 5. Trip planning — find routes between two stops
SELECT DISTINCT r.route_id, r.route_name, r.start_point, r.end_point
FROM route r
JOIN route_stop rs1 ON r.route_id = rs1.route_id
JOIN stop s1 ON rs1.stop_id = s1.stop_id
JOIN route_stop rs2 ON r.route_id = rs2.route_id
JOIN stop s2 ON rs2.stop_id = s2.stop_id
WHERE s1.stop_name LIKE '%Kabuga%'
AND s2.stop_name LIKE '%Nyabugogo%'
AND rs1.stop_order < rs2.stop_order
AND r.status = 'Active';

-- 6. Live tracking — latest GPS of every active bus
SELECT b.bus_number, b.status,
       bl.latitude, bl.longitude, bl.speed, bl.recorded_at, r.route_name
FROM bus b
JOIN bus_location bl ON b.bus_id = bl.bus_id
LEFT JOIN trip t ON bl.trip_id = t.trip_id
LEFT JOIN route r ON t.route_id = r.route_id
WHERE bl.recorded_at = (
    SELECT MAX(bl2.recorded_at) FROM bus_location bl2 WHERE bl2.bus_id = b.bus_id
) AND b.status = 'Active'
ORDER BY bl.recorded_at DESC;

-- 7. Get all ongoing trips with bus and route info
SELECT t.trip_id, b.bus_number, b.license_plate,
       r.route_name, r.start_point, r.end_point, t.start_time, t.status
FROM trip t
JOIN bus b ON t.bus_id = b.bus_id
JOIN route r ON t.route_id = r.route_id
WHERE t.status = 'Ongoing';

-- 8. Get unread notifications for a user
SELECT n.notification_id, n.title, n.message, n.type, n.created_at
FROM notifications n
JOIN users u ON n.user_id = u.user_id
WHERE u.email = 'alice@gmail.com' AND n.status = 'Unread'
ORDER BY n.created_at DESC;

-- 9. GPS history for a specific bus
SELECT b.bus_number, bl.latitude, bl.longitude, bl.speed, bl.recorded_at
FROM bus_location bl
JOIN bus b ON bl.bus_id = b.bus_id
WHERE b.bus_number = 'KBS-003'
ORDER BY bl.recorded_at ASC;

-- 10. Count active trips per route (admin dashboard)
SELECT r.route_name, COUNT(t.trip_id) AS active_trips
FROM route r
LEFT JOIN trip t ON r.route_id = t.route_id AND t.status = 'Ongoing'
WHERE r.status = 'Active'
GROUP BY r.route_id, r.route_name
ORDER BY active_trips DESC;

-- 11. Search routes by keyword
SELECT route_id, route_name, start_point, end_point, route_type
FROM route
WHERE route_name LIKE '%Nyabugogo%'
OR start_point LIKE '%Nyabugogo%'
OR end_point LIKE '%Nyabugogo%';

-- 12. Get all terminal stops
SELECT stop_name, latitude, longitude, district
FROM stop WHERE is_terminal = TRUE ORDER BY district;