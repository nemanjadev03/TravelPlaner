# MERN Travel Planner

A full-stack **MERN** application for managing cities, routes, and visualizing the shortest travel paths between destinations.  
Includes authentication, admin tools, route creation, and a D3-powered interactive graph.


## Quick Start

1. Install MongoDB locally and make sure it is running.
2. Backend:

```
cd backend
npm install
npm run seed
npm run dev
```

3. Frontend:

```
cd ../frontend
npm install
npm start
```

4. Open http://localhost:3000 and login `admin@example.com` / `admin123` (from seed).

Authentication & Security

JWT-based authentication

JOI validation for request bodies

RBAC (Role-Based Access Control) with separate admin/user capabilities

Cities & Routes Management

Full CRUD for Cities and Routes

API supports pagination, sorting, and filtering

Routes store:

startCity

endCity

distance

additional metadata

D3 Graph Visualization

Interactive graph rendering of all cities and routes

Visualizes connections in real-time

Clicking nodes shows city details

Clicking edges shows route details

Dijkstra Shortest Path

Backend algorithm calculates shortest path between any two cities

API returns:

pathIds (route IDs in order)

pathNames (decoded city/route names)

distance (total cost)

Modern UI (Tailwind)

Tailwind-based responsive design

Clean dashboard layout

Admin interface for adding/editing Cities and Routes

Intuitive form for creating new routes between cities

Tech Stack

Frontend

React

TailwindCSS

Axios

D3.js

Backend

Node.js + Express

MongoDB + Mongoose

JOI validation

JWT authentication
