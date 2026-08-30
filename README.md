# TaskFlow

A full-stack project management platform for creating, assigning, and tracking projects and tasks in real time.

## Features

- User authentication with JWT and bcrypt password hashing
- Role-based authorization
- CRUD operations for projects and tasks, with validation, search, and pagination
- Real-time notifications and activity logging via WebSockets
- Dockerized for consistent local and production deployment

## Architecture

- **Frontend:** React
- **Backend:** Node.js + Express.js, following a modular Route → Controller → Service structure
- **API:** RESTful, with parameterized queries and connection pooling for safe, consistent DB access
- **Database:** PostgreSQL, with a normalized schema and relational constraints
- **Auth:** JWT-based authentication, bcrypt password hashing, role-based access control
- **Real-time:** WebSocket-based notifications and activity logs
- **Deployment:** Docker

## Tech Stack

React, Node.js, Express.js, PostgreSQL, JWT, WebSockets, Docker

## Setup

1. Clone this repo
2. Install dependencies in both `client/` and `server/` (`npm install` in each, if applicable)
3. Create a `.env` file in `server/` with your database connection details and JWT secret (see `.env.example` if provided)
4. Run the PostgreSQL database (locally or via Docker)
5. Start the backend: `npm run dev` (or your configured start script) from `server/`
6. Start the frontend: `npm start` from `client/`, if applicable

## Status

Core functionality (auth, CRUD, PostgreSQL schema, WebSocket notifications) implemented. Actively being extended.
