USE smart_transport_tracker;

CREATE INDEX idx_bus_number
ON bus(bus_number);

CREATE INDEX idx_route_name
ON route(route_name);

CREATE INDEX idx_trip_status
ON trip(status);

CREATE INDEX idx_stop_name
ON stop(stop_name);