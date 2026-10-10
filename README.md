# HotelPro

A complete, functional, secure, and responsive MERN stack hotel booking and management application.

## Features (Planned)
- Guest-facing booking website with search and filters
- User authentication and authorization (JWT)
- Role-based access (Admin/Guest)
- Admin dashboard for room and booking management
- Room inventory system
- Secure payment integration placeholder

## Tech Stack
- **Frontend**: React.js with Vite, Bootstrap 5, React Router DOM, Axios, Lucide React
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs

## Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

## Setup Instructions

1. **Environment Variables**
   - In the `server` directory, copy `.env.example` to `.env` and fill in your MongoDB URI and JWT secret.
   - In the `client` directory, copy `.env.example` to `.env`.

2. **Install Dependencies**
   The project has been pre-configured with root and workspace dependencies. To ensure everything is installed:
   ```bash
   npm run setup # if defined, or install separately
   cd server && npm install
   cd ../client && npm install
   cd .. && npm install
   ```

3. **Running Locally**
   To start both frontend and backend concurrently from the root directory:
   ```bash
   npm run dev
   ```
   - Client will run on http://localhost:5173
   - Server API will run on http://localhost:5000

## Next Steps for Development
- Complete room and booking controllers.
- Build React components (Navbar, Footer, RoomCard, etc.).
- Integrate state management/context for auth.
- Build Admin Dashboard views.
- Write tests.
