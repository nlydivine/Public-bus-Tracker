-- ==========================================
-- Indexes Script (Upgraded)
-- ==========================================
USE smart_transport_tracker;

CREATE INDEX IF NOT EXISTS idx_bus_status        ON bus(status);
CREATE INDEX IF NOT EXISTS idx_route_type        ON route(route_type);
CREATE INDEX IF NOT EXISTS idx_trip_status       ON trip(status);
CREATE INDEX IF NOT EXISTS idx_trip_bus          ON trip(bus_id);
CREATE INDEX IF NOT EXISTS idx_trip_route        ON trip(route_id);
CREATE INDEX IF NOT EXISTS idx_route_stop_route  ON route_stop(route_id);
CREATE INDEX IF NOT EXISTS idx_route_stop_stop   ON route_stop(stop_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user   ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_bus_location_bus_time ON bus_location(bus_id, recorded_at);