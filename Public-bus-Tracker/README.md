# Kigali Public Transport Tracker (TransitX)

## Overview

The Kigali Public Transport Tracker ("TransitX") is a web application designed to improve the commuting experience in Kigali by giving passengers route information, distance-based fare estimates, and bus arrival predictions. It was developed as part of a Software Engineering course to demonstrate system design, database management, backend development, frontend implementation, and team collaboration.

There are no real GPS trackers fitted to any buses yet, so a **movement simulator** (`simulateBuses.js`) drives realistic, moving bus positions through the same API a real tracker device would use. Everything downstream — the API, the map, the ETA estimates — works exactly as it will once real hardware is wired in.

## Problem Statement

Passengers using public transportation in Kigali often face:

* Uncertainty about bus arrival times.
* Long waiting periods at bus stops.
* Limited access to bus location information.
* Difficulty planning trips efficiently.
* Inadequate communication regarding delays or service disruptions.

## Proposed Solution

TransitX gives passengers a single place to:

* Look up bus routes and stops.
* See buses moving on a live map.
* Get a distance-based fare estimate between any two stops.
* Get a rough arrival-time estimate for the nearest bus.

## Features

### Implemented

* Responsive landing page and trip-planning dashboard.
* MySQL-backed REST API (buses, routes, route stops, fares, stops, GPS locations).
* Interactive Leaflet/OpenStreetMap view of stops and live bus positions.
* Distance-based fare calculator (RURA tariff: 59.28 RWF/km, 300 RWF minimum).
* Simulated GPS bus movement (`simulateBuses.js`) — buses travel stop-to-stop along their route, looping back and forth, reporting a GPS ping every few seconds.
* ETA endpoint (`/api/eta/:bus_id/:stop_id`) using haversine distance + last known/typical speed.
* "Next bus" estimate on the trip dashboard.
* English / Kinyarwanda language toggle.
* USSD entry point stub for feature-phone access (`/api/ussd`, `controllers/ussdController.js`).

### Planned / Not yet implemented

* Real GPS hardware integration (the simulator is a stand-in for this).
* User authentication and accounts.
* Push/SMS notifications for delays and service changes.
* Driver and transport-administrator dashboards.
* Bus occupancy information.
* Road-network-aware ETA (current ETA is straight-line distance, not routed distance).

## Technology Stack

**Frontend:** HTML5, CSS3, JavaScript, [Leaflet.js](https://leafletjs.com/) + OpenStreetMap tiles

**Backend:** Node.js, Express 5

**Database:** MySQL (via `mysql2`)

**Dev tools:** Git, GitHub, VS Code, Figma

> Earlier drafts of this project used MongoDB and Socket.IO; the shipped app uses MySQL with a plain REST API (see "A note on the `server/` folder" below).

## System Architecture

```
+---------------------------+
|        Frontend           |
| HTML • CSS • JavaScript   |
| (Leaflet map, fetch())    |
+------------+--------------+
             |
             | HTTP Requests
             |
+------------v--------------+
|     Express.js Server     |
|  index.js + /routes       |
+------------+--------------+
             |
             | mysql2
             |
+------------v--------------+
|          MySQL            |
| bus • route • stop        |
| route_stop • bus_location |
| trip • users • notifications
+---------------------------+
```

The bus simulator (`simulateBuses.js`) runs inside the same Node process, alongside the Express server, and talks to the API over plain HTTP just like an external GPS device would (`POST /api/gps`).

## Database Design

Full DDL lives in `database/schema.sql`. Summary:

| Table         | Purpose                                              |
| ------------- | ----------------------------------------------------- |
| `users`       | Passenger/admin accounts                              |
| `bus`         | Fleet: bus number, plate, capacity, status             |
| `route`       | Named routes with start/end point and distance         |
| `stop`        | Physical bus stops with lat/lng                        |
| `route_stop`  | Ordered stops that make up a route                     |
| `trip`        | A bus's scheduled/ongoing/completed run on a route      |
| `bus_location`| GPS pings (real or simulated) for a bus, timestamped   |
| `notifications`| Delay/cancellation/route-change messages to users     |

`database/sample_data.sql` seeds all of the above with realistic Kigali routes, stops, and coordinates.

## Project Structure

```
Public-bus-Tracker/
│
├── index.js                 # App entry point (Express server + static frontend)
├── db.js                    # MySQL connection (mysql2), reads .env
├── simulateBuses.js         # Fakes realistic GPS movement over the real API
│
├── routes/                  # Express routers
│   ├── buses.js
│   ├── routes.js
│   ├── fares.js
│   ├── gps.js
│   ├── stops.js
│   ├── eta.js
│   └── ussd.js
│
├── controllers/
│   ├── eta.js                # Haversine distance + ETA math
│   └── ussdController.js
│
├── database/
│   ├── schema.sql
│   ├── sample_data.sql
│   ├── indexes.sql
│   ├── procedures.sql
│   ├── triggers.sql
│   ├── views.sql
│   └── queries.sql
│
├── frontend/
│   ├── index.html            # Landing page
│   ├── app.html               # Trip-planner dashboard + live map
│   ├── css/
│   └── js/
│       ├── app.js             # Map, fare calc, live GPS polling, next-bus ETA
│       └── i18n.js
│
├── gps/                       # Standalone Leaflet experiments (not wired into the app)
├── .env                        # Local DB credentials (not committed)
├── package.json
└── README.md
```

### A note on the `server/` folder

This repo also contains a `server/` folder with its own `server.js`, an alternate SQLite-backed `db.js`, and Socket.IO. It was an earlier prototype and is **not** what `npm start` runs, its `transport.db` ships empty, and a couple of its routes call a `db.query()` method that its own `db.js` doesn't actually expose. Leave it alone (or delete it) — everything in this README refers to the working app at the project root (`index.js` + `/routes` + MySQL).

## Setup & Installation (XAMPP / phpMyAdmin workflow)

1. **Start MySQL.** In XAMPP's control panel, start the `MySQL` module (Apache only matters if you also want phpMyAdmin's UI).
2. **Create the database.** Open phpMyAdmin → *Import* (or the *SQL* tab) and run, **in this order**:
   1. `database/schema.sql` — creates the `public_transport_tracker` database and all tables.
   2. `database/sample_data.sql` — seeds it with buses, routes, stops, and sample trips.
   3. (Optional) `indexes.sql`, `views.sql`, `procedures.sql`, `triggers.sql`.
3. **Configure `.env`** in the project root to match your XAMPP MySQL instance:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=public_transport_tracker
   DB_PORT=3306
   ```
   (XAMPP's default MySQL user is `root` with an empty password.)
4. **Install dependencies** (only needed once, or after pulling changes to `package.json`):
   ```bash
   npm install
   ```
5. **Run the app** from the project root (not from `server/`):
   ```bash
   npm start
   ```
   which just runs `node index.js`. If `npm start` doesn't work on your machine for some reason, `node index.js` does exactly the same thing and is a fine substitute.

## Testing it out

1. After starting the server you should see in the terminal:
   ```
   Server is running on http://localhost:3000
   [simulator] simulating 5 bus(es) across 8 route(s)
   ```
   If it instead says `no active buses/routes with stops found`, re-check that `sample_data.sql` imported successfully.
2. Open `http://localhost:3000/` in a browser, then **Launch Application Dashboard**.
3. On the map, bus emoji markers should appear on real Kigali roads and drift a little every ~4 seconds as the simulator reports new positions.
4. Pick an origin and destination stop — fare, distance, and a **"Next bus"** estimate should update, along with a route line on the map.
5. To inspect the raw feed directly: `http://localhost:3000/api/gps` — refresh it a few times and you'll see `recorded_at` timestamps and coordinates changing.
6. To test the ETA endpoint directly: `http://localhost:3000/api/eta/3/1` (any valid `bus_id`/`stop_id` pair) returns distance and an estimated arrival time.
7. To turn the simulator off (e.g. once real GPS trackers exist), set `SIMULATE_BUSES=false` in `.env`.

## API Endpoints

| Method | Endpoint                     | Description                                     |
| ------ | ----------------------------- | ------------------------------------------------ |
| GET    | `/api/buses`                  | List all buses                                   |
| GET    | `/api/buses/:id`               | Get a single bus                                 |
| POST   | `/api/buses`                   | Add a new bus                                    |
| GET    | `/api/routes`                   | List all routes                                  |
| GET    | `/api/routes/:id`                | Get a single route                              |
| GET    | `/api/routes/:id/stops`          | Ordered stops for a route                       |
| GET    | `/api/fares`                     | Fare per route                                  |
| GET    | `/api/fares/:id`                  | Fare for a single route                        |
| GET    | `/api/stops`                       | List all bus stops                            |
| GET    | `/api/stops/:id`                    | Get a single stop                             |
| GET    | `/api/gps`                            | Latest GPS pings for all buses (real or simulated) |
| GET    | `/api/gps/:bus_id`                     | Latest GPS ping for one bus                  |
| POST   | `/api/gps`                              | Report a new GPS ping (used by real trackers and by `simulateBuses.js`) |
| GET    | `/api/eta/:bus_id/:stop_id`               | Distance + estimated arrival time for a bus to a stop |
| POST   | `/api/ussd`                                | USSD menu entry point (feature-phone access) |

## Technical Challenges and Solutions

| Challenge                                    | Solution                                                                                    |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- |
| No access to real bus GPS hardware              | Built `simulateBuses.js`, which moves each bus along its route's real stop coordinates and reports pings through the same `/api/gps` endpoint a real tracker would use. |
| No arrival-time prediction                       | Added `controllers/eta.js` + `routes/eta.js`, combining haversine distance with last known (or typical) bus speed. |
| Database name mismatch between schema/seed files  | `schema.sql`, `sample_data.sql`, and `.env` now all agree on `public_transport_tracker`. |
| Coordinating development among team members         | Git branches, pull requests, and GitHub for version control and collaboration.       |

## Future Enhancements

* Real GPS hardware integration to replace `simulateBuses.js`.
* Road-network-aware ETA (routing distance instead of straight-line).
* User authentication and accounts.
* Push/SMS delay and cancellation notifications.
* Driver and administrator dashboards.
* Bus occupancy information.

## Team

Project development engineering team — African Leadership University, BSc. Software Engineering, 2026:

* Nyayath Chol
* Oluwatomi Thompson
* Prince Ishimwe
* Tiffany Lina Turate
* Nshuti Lydivine

## References

* Node.js Documentation
* Express.js Documentation
* MySQL / mysql2 Documentation
* Leaflet.js Documentation
* OpenStreetMap Documentation
* Git & GitHub Documentation

## License

Developed for educational purposes as part of a Software Engineering course at the African Leadership University.
