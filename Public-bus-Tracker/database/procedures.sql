-- ==========================================
-- Stored Procedures Script
-- ==========================================
USE public_transport_tracker;

DELIMITER $$

CREATE PROCEDURE RegisterBus(
    IN p_bus_number    VARCHAR(20),
    IN p_license_plate VARCHAR(20),
    IN p_capacity      INT,
    IN p_operator      VARCHAR(100)
)
BEGIN
    INSERT INTO bus (bus_number, license_plate, capacity, status, operator)
    VALUES (p_bus_number, p_license_plate, p_capacity, 'Active', p_operator);
    SELECT LAST_INSERT_ID() AS new_bus_id;
END$$

CREATE PROCEDURE UpdateBusLocation(
    IN p_bus_id  INT,
    IN p_trip_id INT,
    IN p_lat     DECIMAL(10,6),
    IN p_lng     DECIMAL(10,6),
    IN p_speed   DECIMAL(5,2)
)
BEGIN
    INSERT INTO bus_location (bus_id, trip_id, latitude, longitude, speed, recorded_at)
    VALUES (p_bus_id, p_trip_id, p_lat, p_lng, p_speed, NOW());
END$$

CREATE PROCEDURE StartTrip(
    IN p_bus_id   INT,
    IN p_route_id INT
)
BEGIN
    INSERT INTO trip (bus_id, route_id, start_time, status)
    VALUES (p_bus_id, p_route_id, NOW(), 'Ongoing');
    SELECT LAST_INSERT_ID() AS new_trip_id;
END$$

CREATE PROCEDURE EndTrip(IN p_trip_id INT)
BEGIN
    UPDATE trip SET end_time = NOW(), status = 'Completed'
    WHERE trip_id = p_trip_id;
END$$

CREATE PROCEDURE SendNotification(
    IN p_user_id INT,
    IN p_title   VARCHAR(150),
    IN p_message TEXT,
    IN p_type    ENUM('Delay','Cancellation','Arrival','RouteChange','General')
)
BEGIN
    INSERT INTO notifications (user_id, title, message, type, status)
    VALUES (p_user_id, p_title, p_message, p_type, 'Unread');
END$$

DELIMITER ;