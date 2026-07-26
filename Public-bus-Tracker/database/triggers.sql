-- ==========================================
-- Triggers Script
-- ==========================================
USE public_transport_tracker;

DELIMITER $$

CREATE TRIGGER after_bus_location_insert
AFTER INSERT ON bus_location
FOR EACH ROW
BEGIN
    UPDATE bus SET created_at = NEW.recorded_at WHERE bus_id = NEW.bus_id;
END$$

CREATE TRIGGER before_trip_insert
BEFORE INSERT ON trip
FOR EACH ROW
BEGIN
    DECLARE bus_status VARCHAR(20);
    SELECT status INTO bus_status FROM bus WHERE bus_id = NEW.bus_id;
    IF bus_status = 'Maintenance' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Cannot assign a trip to a bus under maintenance.';
    END IF;
END$$

CREATE TRIGGER after_trip_cancelled
AFTER UPDATE ON trip
FOR EACH ROW
BEGIN
    IF NEW.status = 'Cancelled' AND OLD.status != 'Cancelled' THEN
        INSERT INTO notifications (user_id, title, message, type, status)
        SELECT user_id,
               'Trip Cancelled',
               CONCAT('Trip #', NEW.trip_id, ' has been cancelled.'),
               'Cancellation', 'Unread'
        FROM users WHERE role = 'Admin' LIMIT 1;
    END IF;
END$$

DELIMITER ;