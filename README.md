# 🚌 Kigali Public Transport Tracker

A real-time public transport tracking system developed to improve the accessibility, efficiency, and reliability of public transportation in Kigali, Rwanda. The system allows commuters to track buses on a live map, view routes and bus stops, check fares, and access transport information through both a web application and a USSD service.

---

# 📖 Table of Contents

- Project Overview
- Problem Statement
- Objectives
- Features
- System Architecture
- Technology Stack
- Project Structure
- Installation Guide
- Database Setup
- Environment Variables
- Running the Project
- GPS Simulator
- USSD Integration
- API Endpoints
- Testing
- Screenshots
- Future Improvements
- Contributors
- License

---

# 🚍 Project Overview

Public transportation is an essential service in Kigali, serving thousands of commuters daily. However, passengers often experience uncertainty due to the lack of real-time bus location information.

The Kigali Public Transport Tracker addresses this challenge by integrating GPS tracking, a web application, and a USSD platform to provide passengers with accurate and up-to-date transport information.

The system enables:

- Live bus tracking
- Route management
- Bus stop information
- Fare lookup
- Delay reporting
- USSD access for feature phones
- GPS simulation for testing

---

# ❗ Problem Statement

Many commuters in Kigali experience long waiting times and uncertainty because they do not know the current location of buses or available routes.

Existing solutions provide limited real-time tracking and are often inaccessible to users without smartphones or internet access.

This project was developed to improve the passenger experience by providing real-time transport information through both web and USSD technologies.

---

# 🎯 Objectives

## Main Objective

To develop a real-time public transport tracking system that improves accessibility and efficiency for commuters in Kigali.

### Specific Objectives

- Track buses using GPS.
- Display buses on an interactive map.
- Show available routes.
- Display bus stops.
- Provide fare information.
- Allow passengers to report delays.
- Support USSD access.
- Store GPS location history.
- Provide REST APIs for transport data.

---

# Features

## Web Application

- Interactive map
- Live GPS tracking
- Bus routes
- Bus stops
- Fare information
- Responsive interface

## Backend

- REST API
- MySQL integration
- GPS data processing
- Route management
- Bus management
- Stop management

## USSD

- Bus arrival lookup
- Route search
- Fare lookup
- Nearby stops
- Delay reporting
- English support
- Kinyarwanda support

## GPS

- Real-time location updates
- GPS simulator
- Historical location storage

---

# 🏗 System Architecture

```
                +----------------------+
                |     GPS Devices      |
                +----------+-----------+
                           |
                           |
                           v
                +----------------------+
                |   Express REST API   |
                |      Node.js         |
                +----------+-----------+
                           |
                           |
                           v
                +----------------------+
                |     MySQL Database   |
                +----------+-----------+
                           |
          +----------------+----------------+
          |                                 |
          |                                 |
          v                                 v

   Web Application                    USSD Service
          |                                 |
          +---------------+-----------------+
                          |
                          |
                    Public Users
```

---

# 💻 Technology Stack

## Frontend

- HTML5
- CSS3
- JavaScript
- Leaflet.js

## Backend

- Node.js
- Express.js

## Database

- MySQL

## APIs

- REST API

## GPS

- Leaflet Maps
- GPS Simulator

## USSD

- Africa's Talking Sandbox

## Development Tools

- Visual Studio Code
- Git
- GitHub
- XAMPP
- phpMyAdmin
- Postman
- Ngrok

---

# Project Structure

```
Public-bus-Tracker/

│
├── controllers/
│      ussdController.js
│
├── routes/
│      buses.js
│      routes.js
│      stops.js
│      gps.js
│      ussd.js
│
├── models/
│
├── gps/
│      simulator.js
│
├── frontend/
│      index.html
│      app.html
│
│      css/
│           global.css
│           dashboard.css
│           home.css
│
│      js/
│           app.js
│
├── database/
│      database.sql
│
├── config/
│      db.js
│
├── server.js
├── package.json
└── README.md
```

---

# ⚙ Installation Guide

## Step 1

Clone the repository

```bash
git clone https://github.com/yourusername/Public-bus-Tracker.git
```

---

## Step 2

Move into the project

```bash
cd Public-bus-Tracker
```

---

## Step 3

Install dependencies

```bash
npm install
```

---

## Step 4

Start MySQL

Using XAMPP

- Start Apache
- Start MySQL

---

# 🗄 Database Setup

Create a database named

```
public_transport_tracker
```

Import

```
database.sql
```

using phpMyAdmin.

---

# Environment Variables

Create a `.env` file.

Example

```env
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=public_transport_tracker

AT_API_KEY=YOUR_API_KEY
AT_USERNAME=sandbox
```

---

# ▶ Running the Server

```bash
node server.js
```

or

```bash
npm start
```

You should see

```
Server running on port 3000

MySQL Database Connected Successfully
```

---

# 📡 GPS Simulator

Run

```bash
node gps/simulator.js
```

The simulator continuously updates bus locations in the database.

Example output

```
Bus 1 updated

Bus 2 updated

Bus 3 updated
```

---

# USSD Integration

The project integrates with Africa's Talking Sandbox.

Example menu

```
Welcome

1. Check Bus Arrival

2. Find Route

3. Check Fare

4. Nearby Bus Stops

5. Report Delay

6. Exit
```

Supported Languages

- English
- Kinyarwanda

---

# 🌐 API Endpoints

## Buses

```
GET /api/buses
```

Returns all buses.

---

## Routes

```
GET /api/routes
```

Returns all routes.

---

## Stops

```
GET /api/stops
```

Returns all bus stops.

---

## GPS

```
GET /api/gps
```

Returns current GPS locations.

---

## GPS by Bus

```
GET /api/gps/:bus_id
```

Returns the latest GPS location for a specific bus.

---

## USSD

```
POST /api/ussd
```

Processes USSD requests.

---

# Testing

The project was tested using

- Postman
- Africa's Talking Sandbox
- GPS Simulator
- Browser Testing
- MySQL Database Testing
- Integration Testing

---

# 📷 Screenshots

Add screenshots here.

Example

```
screenshots/

home-page.png

dashboard.png

live-map.png

route-search.png

ussd-menu.png
```

---

#  Future Improvements

- Mobile application
- Push notifications
- AI arrival prediction
- Driver mobile application
- Passenger accounts
- Electronic ticketing
- QR code payments
- Traffic congestion analysis
- Admin dashboard
- Analytics dashboard

---

# Contributors

Oluwatomi Joshua Thompson
Nyayath Lual Deng
Nshuti Lydivine
Tiffany Lina Sangwa Turate
Prince Hugue Ishimwe

BSc Software Engineering

African Leadership University

---

# 📄 License

This project was developed for academic purposes as part of the Foundations Project for the Bachelor of Science in Software Engineering at African Leadership University.

You are free to use, modify, and improve this project for educational and research purposes.

---

#  Acknowledgements

Special thanks to:

- African Leadership University
- Rwanda Transport Stakeholders
- Africa's Talking
- OpenStreetMap
- Leaflet.js
- Node.js Community
- Express.js Community
- MySQL Community

---

⭐ If you find this project useful, consider starring the repository on GitHub.
