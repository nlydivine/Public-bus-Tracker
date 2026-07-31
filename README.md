# Kigali Public Transport Tracker

A real-time public transport tracking system developed to improve accessibility, reliability, and efficiency of public transportation in Kigali, Rwanda.

The system combines **GPS tracking, a web-based transport dashboard, MySQL database management, and USSD technology** to provide passengers with real-time bus information.

Passengers can:

* Track buses on a live map
* View Kigali bus routes
* Find bus stops
* Check fares
* Access transport information through USSD
* Report delays
* Use the service without internet access through USSD

---

# Table of Contents

* Project Overview
* Problem Statement
* Objectives
* Features
* System Architecture
* Technology Stack
* Project Structure
* Installation Guide
* Database Setup
* Database Structure
* Environment Variables
* Running the Project
* GPS Simulator
* USSD Integration
* API Endpoints
* Testing
* Screenshots
* Future Improvements
* Contributors
* License

---

# 🚍 Project Overview

Public transportation is one of the most important services in Kigali, Rwanda. However, many passengers experience challenges caused by a lack of real-time information about bus locations, routes, and arrival times.

The Kigali Public Transport Tracker was developed to solve this problem by providing a digital platform that connects passengers with transport information.

The system integrates:

* GPS-based bus tracking
* Interactive web mapping
* Route management
* Bus stop management
* Fare information
* USSD access for feature phone users

The system supports both smartphone users through the web application and users without internet access through USSD.

---

# Problem Statement

Many public transport users in Kigali experience:

* Long waiting times at bus stops
* Difficulty knowing bus locations
* Limited access to route information
* Lack of real-time transport updates

Most existing transport solutions depend on smartphones and internet connectivity, leaving some passengers without access.

This project addresses this challenge by developing an inclusive transport tracking system accessible through both web and USSD platforms.

---

#  Objectives

# Main Objective

To develop a real-time public transport tracking system that improves transport accessibility and passenger experience in Kigali.

## Specific Objectives

* Develop a web application for bus tracking.
* Integrate GPS technology for live bus locations.
* Store transport information using MySQL.
* Display Kigali bus routes and stops.
* Provide fare information.
* Develop USSD access for feature phone users.
* Support English and Kinyarwanda languages.
* Allow passengers to report delays.
* Provide REST APIs for transport data.

---

#  Features

# Web Application

* Interactive Leaflet map
* Live bus location display
* Kigali route visualization
* Bus stop information
* Route management
* Fare information
* Responsive user interface

# Backend System

* REST API services
* MySQL database integration
* Route management
* Bus management
* GPS data processing
* USSD processing

# USSD Service

The USSD service allows passengers without smartphones to access transport information.

Features:

* Language selection
* Bus arrival information
* Route search
* Fare lookup
* Nearby bus stops
* Delay reporting

Supported languages:

* English
* Kinyarwanda

# GPS Tracking

* Live GPS updates
* GPS simulator
* Bus location history
* Speed tracking
* Database storage

---

#  System Architecture


<img width="520" height="544" alt="kigali_tracker_data_flow_architecture (1)" src="https://github.com/user-attachments/assets/1deb890f-20fc-42c9-bf7e-19a9cf73b1d7" />


---

# 💻 Technology Stack

## Frontend

* HTML5
* CSS3
* JavaScript
* Leaflet.js

## Backend

* Node.js
* Express.js

## Database

* MySQL

## APIs

* REST API

## GPS

* GPS Simulator
* Leaflet Maps

## USSD

* Africa's Talking Sandbox

## Development Tools

* Visual Studio Code
* Git
* GitHub
* XAMPP
* phpMyAdmin
* Postman
* Ngrok

---

# 📂 Project Structure

```
Public-bus-Tracker/

│
├── controllers/
│      └── ussdController.js
│
├── routes/
│      ├── buses.js
│      ├── routes.js
│      ├── stops.js
│      ├── gps.js
│      └── ussd.js
│
├── services/
│      └── etaService.js
│
├── gps/
│      └── simulator.js
│
├── frontend/
│      ├── index.html
│      ├── app.html
│      │
│      ├── css/
│      │     ├── global.css
│      │     ├── dashboard.css
│      │     └── home.css
│      │
│      └── js/
│            └── app.js
│
├── database/
│      └── database.sql
│
├── db.js
├── index.js
├── package.json
└── README.md
```

---

# ⚙ Installation Guide

## Clone Repository

```bash
git clone git@github.com:nlydivine/Public-bus-Tracker.git
```

Move into the project:

```bash
cd Public-bus-Tracker
```

---

## Install Dependencies

```bash
npm install
```

---

# 🗄 Database Setup

Start XAMPP:

Enable:

* Apache
* MySQL

Create database:

```
public_transport_tracker
```

Import:

```
database/database.sql
```

using phpMyAdmin.

---

# Database Structure

The system uses the following tables:

| Table         | Purpose                        |
| ------------- | ------------------------------ |
| users         | Stores system users            |
| bus           | Stores bus information         |
| route         | Stores Kigali transport routes |
| stop          | Stores bus stop locations      |
| route_stop    | Connects routes and stops      |
| trip          | Stores scheduled trips         |
| bus_location  | Stores GPS history             |
| notifications | Stores passenger notifications |

---

# Kigali Route Database

The system contains Kigali transport routes including:

* Nyabugogo routes
* Downtown routes
* Remera routes
* Kimironko routes
* Kacyiru routes
* Kicukiro routes
* Kanombe routes
* Kabuga routes
* Nyamirambo routes
* Masaka routes

The same route database is used by:

* Web Application
* USSD Service

---

# Environment Variables

Create:

```
.env
```

Example:

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

# ▶ Running the Project

Start backend:

```bash
node index.js
```

Expected output:

```
Server running at http://localhost:3000

MySQL Database Connected Successfully
```

---

# GPS Simulator

The GPS simulator generates bus movement data for testing.

Run:

```bash
node gps/simulator.js
```

Example:

```
Bus 1 updated
Bus 2 updated
Bus 3 updated
```

GPS information is stored inside:

```
bus_location
```

table.

---

# 📱 USSD Integration

The system integrates with Africa's Talking Sandbox to provide transport services through mobile networks.

USSD endpoint:

```
POST /api/ussd
```

---

# USSD Menu

```
Welcome to Kigali Public Transport Tracker

1. English
2. Kinyarwanda
```

---

# English Menu

```
1. Check Bus Arrival
2. Find Route
3. Check Fare
4. Nearby Bus Stops
5. Report Delay
6. Exit
```

---

# Kinyarwanda Menu

```
1. Kureba igihe imodoka igerera aho uhagaze
2. Gushaka inzira y'urugendo
3. Kureba amafaranga y'urugendo
4. Kureba ahahagarara imodoka
5. Kumenyesha gutinda kw'imodoka
6. Gusohoka
```

---

# USSD Features

## Bus Arrival

Users can select a bus stop and receive:

* Bus number
* Route name
* Current location
* Distance
* Estimated arrival time

## Route Search

Routes are loaded dynamically from MySQL.

Example:

```
Kabuga - Nyabugogo via Sonatube

Rubirizi - Downtown

Kibaya - Kanombe Airport - Downtown

Remera - Nyabugogo
```

## Fare Lookup

Fare calculation:

```
Fare = Distance × Fare Rate
```

## Nearby Stops

Displays available Kigali bus stops.

## Delay Reporting

Passengers can report delayed buses.

---

# Africa's Talking Setup

For local testing:

Install and run Ngrok:

```bash
ngrok http 3000
```

Example callback:

```
https://xxxx.ngrok.io/api/ussd
```

This URL is configured in Africa's Talking Sandbox.

---

# 🌐 API Endpoints

## Get Buses

```
GET /api/buses
```

## Get Routes

```
GET /api/routes
```

## Get Stops

```
GET /api/stops
```

# Get GPS Locations

```
GET /api/gps
```

# Get Bus GPS

```
GET /api/gps/:bus_id
```

# USSD

```
POST /api/ussd
```

Example:

```json
{
 "sessionId":"test001",
 "text": "1*2"
}
```

---

#  Testing

The system was tested using:

* Postman
* PowerShell
* Africa's Talking Sandbox
* GPS Simulator
* Browser Testing
* MySQL Testing

Example USSD test:

```powershell
Invoke-RestMethod `
-Uri http://localhost:3000/api/ussd `
-Method POST `
-Body @{
sessionId="test001"
text=""
}
```

Expected:

```
CON Welcome to Kigali Public Transport Tracker

1. English
2. Kinyarwanda
```

---

# Screenshots


screenshots

     home-page.png
<img width="527" height="717" alt="image" src="https://github.com/user-attachments/assets/f194e766-4f6c-4fd9-a762-6b34d21f2b7f" />


       route-search.png
<img width="460" height="540" alt="Screenshot 2026-07-31 212334" src="https://github.com/user-attachments/assets/b665f0c8-122b-459f-9dea-fe412f4f2f02" />


     live-map.png
<img width="527" height="217" alt="image" src="https://github.com/user-attachments/assets/a7835f03-3213-4fb0-996b-e81829d7b1c1" />


       ussd-menu.png

       
<img width="523" height="814" alt="Screenshot 2026-07-26 183149" src="https://github.com/user-attachments/assets/dbf9af52-8be9-4b48-ade0-e6774f4e6eff" />


---

Access the app through this

Web App : https://chat.google.com/room/AAQA97MF-fU/weDySOGqgkk/weDySOGqgkk?cls=10

Demo video: https://www.youtube.com/watch?v=qqVw2wOT6UY


# Future Improvements

* Mobile application
* AI arrival prediction
* Driver mobile application
* Passenger accounts
* Electronic ticketing
* QR code payment
* Traffic analysis
* Admin dashboard
* Analytics dashboard
* Real GPS hardware integration

---

# Contributors

* Oluwatomi Joshua Thompson
* Nyayath Lual Deng
* Nshuti Lydivine
* Tiffany Lina Sangwa Turate
* Prince Hugue Ishimwe

BSc Software Engineering

African Leadership University

---


# 📄 License

This project was developed for academic purposes as part of the Foundations Project for the Bachelor of Science in Software Engineering at African Leadership University.

Free to use, modify, and improve for educational and research purposes.

---

# Acknowledgements

Special thanks to:

* African Leadership University
* Rwanda Transport Stakeholders
* Africa's Talking
* OpenStreetMap
* Leaflet.js
* Node.js Community
* Express.js Community
* MySQL Community

⭐ If you find this project useful, consider starring the repository.
