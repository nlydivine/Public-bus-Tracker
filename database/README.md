# Smart Public Transport Tracker — Database

**Project:** Smart Public Transport Tracker Website
**Location:** Kigali, Rwanda
**Operator:** Kigali Bus Services (KBS)
**Database:** MySQL (XAMPP)
**Branch:** database-hugue

## Tables

| Table | Description |
|---|---|
| users | Registered users (Admin and Passengers) |
| bus | KBS bus fleet with status |
| route | Real KBS routes (Trunk and Zonal) |
| stop | Real Kigali stops with GPS coordinates |
| route_stop | Stops along each route in order |
| trip | Scheduled, ongoing, and completed trips |
| bus_location | GPS coordinates recorded over time |
| notifications | Alerts for delays, cancellations, arrivals |

## Files

| File | Purpose |
|---|---|
| schema.sql | Creates all tables with constraints |
| sample_data.sql | Inserts real Kigali data |
| queries.sql | SQL for all website features |
| views.sql | Database views for common lookups |
| procedures.sql | Stored procedures |
| triggers.sql | Automatic database actions |
| indexes.sql | Performance indexes |

## Setup — Run files in this order

1. schema.sql
2. sample_data.sql
3. indexes.sql
4. views.sql
5. procedures.sql
6. triggers.sql
7. queries.sql (to test)

## Data Sources

- Routes: Kigali Bus Services (kigalibusservices.rw)
- GPS Coordinates: Google Maps
- Trips and users: Realistic simulated data

## Features Supported

- Live Bus Tracking
- Trip Planning
- Route Search
- Notifications
- User Accounts
- Admin Dashboard