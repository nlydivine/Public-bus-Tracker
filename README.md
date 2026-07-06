# Kigali Public Transport Tracker

# Overview

The Kigali Public Transport Tracker is a web application designed to improve the commuting experience in Kigali by providing passengers with real-time information about public buses. The system helps users track bus locations, view available routes, estimate bus arrival times, and receive service updates, enabling them to plan their journeys more efficiently.

This project was developed as part of a Software Engineering course to demonstrate the application of modern software development practices, including system design, database management, backend development, frontend implementation, version control, and team collaboration.



# Problem Statement

Passengers using public transportation in Kigali often face challenges such as:

* Uncertainty about bus arrival times.
* Long waiting periods at bus stops.
* Limited access to real-time bus location information.
* Difficulty planning trips efficiently.
* Inadequate communication regarding delays or service disruptions.

These challenges reduce the reliability and convenience of public transportation.


# Proposed Solution

The Kigali Public Transport Tracker provides a centralized platform that enables passengers to:

* View bus routes.
* Track buses in real time.
* Receive estimated bus arrival times.
* Access bus stop information.
* Receive notifications about delays or service changes.
* Plan trips more efficiently using accurate transport information.


# Project Objectives

* Improve accessibility to public transport information.
* Reduce passenger waiting time.
* Increase confidence in Kigali's public transport system.
* Support efficient journey planning.
* Build a scalable and maintainable transport management platform.


# Features

# Implemented Features

* Responsive landing page.
* Navigation menu.
* Bus route information display.
* Bus stop information.
* Express.js backend server setup.
* RESTful API structure.
* MongoDB database connection.
* GitHub version control and branching workflow.
* Project documentation.

# Planned Features

* Live GPS bus tracking.
* Estimated Time of Arrival (ETA).
* Interactive route maps.
* User authentication and authorization.
* Passenger notifications.
* Driver dashboard.
* Transport administrator dashboard.
* Bus occupancy information.
* Search for buses and routes.
* Mobile-friendly interface.


# Technology Stack

# Frontend

* HTML5
* CSS3
* JavaScript

## Backend

* Node.js
* Express.js

# Database

* MongoDB

# Development Tools

* Git
* GitHub
* Visual Studio Code
* Figma


# Technology Justification

# Node.js

Node.js provides a fast, event-driven runtime that is well suited for applications requiring real-time communication and scalable backend services.

# Express.js

Express.js simplifies backend development by providing lightweight routing, middleware support, and REST API development.

# MongoDB

MongoDB is a flexible NoSQL database that can store dynamic transportation information, such as bus locations, routes, and user data, while supporting future scalability.

# Git & GitHub

Git and GitHub facilitate version control, branch management, collaboration, code reviews, and project tracking among team members.


# System Architecture

The application follows a **Client–Server Architecture** using RESTful APIs.

```
+---------------------------+
|        Frontend           |
| HTML • CSS • JavaScript   |
+------------+--------------+
             |
             | HTTP Requests
             |
+------------v--------------+
|     Express.js Server     |
| Business Logic & APIs     |
+------------+--------------+
             |
             |
+------------v--------------+
|        MongoDB            |
| Routes • Buses • Users    |
+---------------------------+
```


# Database Design

# Users

| Field    | Type     |
| -------- | -------- |
| _id      | ObjectId |
| fullName | String   |
| email    | String   |
| password | String   |
| role     | String   |

# Buses

| Field           | Type     |
| --------------- | -------- |
| _id             | ObjectId |
| busNumber       | String   |
| route           | String   |
| currentLocation | Object   |
| status          | String   |

# Routes

| Field       | Type     |
| ----------- | -------- |
| _id         | ObjectId |
| routeName   | String   |
| origin      | String   |
| destination | String   |
| stops       | Array    |

# Bus Stops

| Field     | Type     |
| --------- | -------- |
| _id       | ObjectId |
| stopName  | String   |
| latitude  | Number   |
| longitude | Number   |


# Project Structure

```
public-transport-tracker/
│
├── public/
│   ├── css/
│   ├── js/
│   ├── images/
│   └── index.html
│
├── routes/
├── controllers/
├── models/
├── middleware/
├── config/
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

# Installation

# Clone the repository

```bash
git clone https://github.com/your-username/public-transport-tracker.git
```

# Navigate into the project

```bash
cd public-transport-tracker
```

# Install dependencies

```bash
npm install
```

# Start the application

```bash
npm start
```

For development mode (if configured):

```bash
npm run dev
```

---

# API Endpoints

| Method | Endpoint      | Description            |
| ------ | ------------- | ---------------------- |
| GET    | `/api/routes` | Retrieve all routes    |
| GET    | `/api/buses`  | Retrieve all buses     |
| GET    | `/api/stops`  | Retrieve all bus stops |
| POST   | `/api/users`  | Register a new user    |
| POST   | `/api/login`  | Authenticate a user    |

---

# Code Quality

The project follows software engineering best practices, including:

* Modular project structure.
* Meaningful variable and function names.
* RESTful API design.
* Separation of concerns.
* Reusable components.
* Consistent formatting and indentation.
* Git branching and pull request workflow.
* Code reviews before merging changes.

---

# Testing

Testing methods used during development include:

* Manual functional testing.
* API endpoint testing.
* Integration testing.
* User interface testing.

These tests help ensure that application features function correctly and integrate seamlessly.

---

# Technical Challenges and Solutions

| Challenge                                   | Solution                                                                            |
| ------------------------------------------- | ----------------------------------------------------------------------------------- |
| Lack of access to live bus GPS data         | Simulated GPS data is currently used while preparing for future GPS integration.    |
| Maintaining clean, scalable code | Adopted a modular MVC architecture with well-organized folders.                          |
| Coordinating development among team members | Used Git branches, pull requests, and GitHub for version control and collaboration. |

---

# Future Enhancements

Future versions of the application will include:

* Live GPS integration.
* ETA prediction using historical traffic data.
* Interactive maps.
* Mobile application support.
* Push notifications.
* Driver mobile application.
* Administrative dashboard.
* Passenger analytics and reporting.
* Integration with Kigali public transport systems.

---

# Team Collaboration

The project is developed collaboratively using GitHub.

Our team follows a structured workflow that includes:

* Feature branching.
* Pull requests.
* Code reviews.
* Regular team meetings.
* GitHub Projects for task management.
* Figma for UI/UX collaboration.

---

# References

* Node.js Documentation
* Express.js Documentation
* MongoDB Documentation
* Git Documentation
* GitHub Documentation
* Figma
* Google Maps Platform Documentation
* OpenStreetMap Documentation

---

# Contributors

*Software Engineering Team*

African Leadership University

2026

---

# License

This project was developed for educational purposes as part of a Software Engineering course at the African Leadership University.
