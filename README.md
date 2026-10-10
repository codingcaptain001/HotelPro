# HotelPro

A complete, functional, secure, and responsive MERN stack hotel booking and management application.

## Features Implemented
- **Backend Architecture**: Node.js, Express, MongoDB (Mongoose).
- **Models**: User, Room, Booking, Payment models with proper validation and relationships.
- **Authentication**: JWT-based secure authentication with HTTP-only cookies, password hashing (bcryptjs), and role-based authorization (Guest/Admin).
- **Room Management API**: Endpoints to fetch available rooms and allow Admins to create new rooms.
- **Booking Management API**: Endpoints to create bookings, enforce capacity limits, and strictly prevent double-bookings using date overlap detection.
- **Project Setup**: Concurrently configured to run both frontend and backend seamlessly.

## Features Pending Implementation (Incomplete)
- **Frontend Pages**: React UI for Home, Room Listing, Room Details, Auth, and Dashboards.
- **Payment Processing**: Currently mock models exist, but Razorpay is not yet integrated.
- **Admin Dashboard UI**: Missing frontend views to manage rooms, bookings, and users.
- **Booking Cancellation**: API endpoint to cancel bookings.

## Setup Instructions

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

## Known Limitations
- The React frontend currently displays the default Vite template and lacks the required booking UI.
- No real payment gateway is functional at this moment.

## Verification Executed
- Project structure successfully built.
- MongoDB connection config validated.
- JWT and bcrypt functionality modeled properly.
- Express server configured.
- Git repository successfully initialized and pushed.
