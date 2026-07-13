USE smart_transport_tracker;

-- USERS

INSERT INTO users(full_name,email,password,role)
VALUES
('John Doe','john@example.com','password123','Passenger'),
('Alice Admin','alice@example.com','admin123','Admin');

-- BUS

INSERT INTO bus(bus_number,license_plate,capacity,status)
VALUES
('RAB-001A','RAD123A',70,'Active'),
('RAB-002B','RAD456B',65,'Active');

-- ROUTES

INSERT INTO route(route_name,start_point,end_point,distance)
VALUES
('Nyabugogo-Kacyiru','Nyabugogo','Kacyiru',12.5),
('Nyabugogo-Remera','Nyabugogo','Remera',10.8);

-- STOPS

INSERT INTO stop(stop_name,latitude,longitude)
VALUES
('Nyabugogo',-1.9423,30.0619),
('Kacyiru',-1.9442,30.0924),
('Remera',-1.9538,30.1043);

-- ROUTE STOPS

INSERT INTO route_stop(route_id,stop_id,stop_order,estimated_time)
VALUES
(1,1,1,0),
(1,2,2,20),
(2,1,1,0),
(2,3,2,18);

-- TRIPS

INSERT INTO trip(bus_id,route_id,start_time,end_time,status)
VALUES
(1,1,'2026-07-13 08:00:00','2026-07-13 08:25:00','Completed'),
(2,2,'2026-07-13 09:00:00','2026-07-13 09:20:00','In Progress');

-- BUS LOCATION

INSERT INTO bus_location(bus_id,latitude,longitude,recorded_at)
VALUES
(1,-1.9425,30.0621,NOW()),
(2,-1.9500,30.0900,NOW());