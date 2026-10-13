# HotelPro

A complete, functional, secure, and responsive MERN stack hotel booking and management application.

## Features Implemented
- **Backend Architecture**: Node.js, Express, MongoDB (Mongoose).
- **Models**: User, Room, Booking, Payment models with proper validation and relationships.
- **Authentication**: JWT-based secure authentication with HTTP-only cookies, password hashing (bcryptjs), and role-based authorization (Guest/Admin).
- **Room Management API**: Endpoints to fetch available rooms and allow Admins to create new rooms.
- **Booking Management API**: Endpoints to create bookings, enforce capacity limits, and strictly prevent double-bookings using date overlap detection. Added secure cancellation API logic.
- **Project Setup**: Concurrently configured to run both frontend and backend seamlessly.
- **React UI**: Home, Room Listing, Room Details, Login, Register, Guest Dashboard, and Admin Portal pages fully connected to the Express backend.
- **Sample Data Seed**: Idempotent seed script populates 8 realistic room records for development and testing.

## Seed Sample Data

Populate the database with 8 realistic sample rooms for frontend testing:

```bash
cd server
npm run seed:rooms
```

**Safety guarantees:**
- Reads credentials from `server/.env` — no hardcoded URIs.
- **Idempotent** — running multiple times updates existing seed records, never inserts duplicates.
- **Non-destructive** — never deletes rooms, bookings, users, or payments.
- The stable `_seedId` field (hidden from API responses) is used as the unique upsert key.
- Exits with code `1` on any failure and closes the connection cleanly.

Sample rooms cover: Deluxe Suite, Executive Suite, Ocean Villa, Single Room, Family Suite, Penthouse, Twin Room (7 types, prices $129–$1,299).

## Features Pending Implementation (Incomplete)
- **Payment Processing**: Currently mock models exist, but Razorpay is not yet integrated.
- **Admin Dashboard UI**: Missing frontend views to manage rooms, bookings, and users.
- **Guest Dashboard UI**: Missing frontend view for guests to view their own bookings and trigger the cancellation API.

## Setup Instructions

## Folder Structure
```
server/
├── index.js
├── app.js
├── package.json
├── models/
├── controllers/
├── routes/
├── middleware/
└── config/
```

1. **Environment Variables**
   - In `server`, copy `.env.example` to `.env` and fill in your MongoDB URI and JWT secret.
   - In `client`, copy `.env.example` to `.env`.

2. **Install Dependencies**
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```

3. **Running Locally**
   To start both frontend and backend concurrently from the root directory:
   ```bash
   npm run dev
   ```

## Setup Documentation
- [Mongoose Database Setup & Models Guide](docs/project-setup/mongoose-database-setup.md)
- [Frontend Implementation Guide](docs/frontend/frontend-implementation.md)

## Architecture Documentation
- [Features Documentation](docs/project-architecture/features.md)
- [Features Hierarchy Diagram](docs/project-architecture/features.mmd)
- [Roles and Responsibilities](docs/project-architecture/roles-and-responsibilities.md)
- [User Flow Documentation](docs/project-architecture/user-flow.md)
- [Mermaid User Flow Diagram Source](docs/project-architecture/user-flow.mmd)
- [MVC Architecture Documentation](docs/project-architecture/mvc-pattern.md)
- [Mermaid MVC Flowchart Source](docs/project-architecture/mvc-pattern.mmd)
- [Server Setup Documentation](docs/project-architecture/server-setup.md)
- [Mermaid Server Setup Flowchart Source](docs/project-architecture/server-setup.mmd)
- [Entity Relationship (ER) Diagram Explanation](docs/project-architecture/er-diagram.md)
- [Mermaid ER Diagram Source](docs/project-architecture/er-diagram.mmd)

## Known Limitations
- Admin Dashboard UI and Guest Dashboard UI views are currently under development.
- Razorpay live payment gateway integration is pending configuration credentials.

## Verification Executed
- Project structure successfully built.
- MongoDB connection config validated.
- JWT and bcrypt functionality modeled properly.
- Express server configured.
- ER Diagram and Architecture documentation created and validated.
- Git repository successfully updated and pushed.
