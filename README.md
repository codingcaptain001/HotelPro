# HotelPro

A complete, functional, secure, and responsive MERN stack hotel booking and management application.

## Features Implemented
- **Backend Architecture**: Node.js, Express, MongoDB (Mongoose).
- **Models**: User, Room, Booking, Payment models with proper validation and relationships.
- **Authentication**: JWT-based secure authentication with HTTP-only cookies, password hashing (bcryptjs), and role-based authorization (Guest/Admin).
- **Room Management API**: Endpoints to fetch available rooms and allow Admins to create new rooms.
- **Booking Management API**: Endpoints to create bookings, enforce capacity limits, and strictly prevent double-bookings using date overlap detection. Added secure cancellation API logic.
- **Project Setup**: Concurrently configured to run both frontend and backend seamlessly.
- **React UI**: Registration, Login, Home, Room Listing, and Room Details pages fully connected to the Express backend.

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
