# Folder Structure & Repository Map

## 1. Top-Level Repository Structure

```
HotelPro/
├── package.json               # Root orchestrator scripts (concurrently dev, seed commands)
├── README.md                  # Executive overview & full-stack quick start
├── docs/                      # Technical documentation repository
├── client/                    # React 19 + Vite frontend application
└── server/                    # Express 5 + Mongoose 9 backend application
```

---

## 2. Frontend Structure (`client/`)

```
client/
├── index.html                 # HTML shell, page title, viewport & Google Fonts links
├── package.json               # Frontend dependencies (React 19, Vite, Bootstrap, Lucide)
├── vite.config.js             # Vite configuration with React SWC plugin & port bindings
├── src/
│   ├── main.jsx               # React entry point, mounts <App /> to DOM #root
│   ├── App.jsx                # Route declarations, dynamic layout shell & ErrorBoundary
│   ├── index.css              # Custom luxury CSS system, tokens, media queries & print styles
│   │
│   ├── assets/                # Static asset files (logos, placeholder graphics)
│   │
│   ├── components/            # Reusable UI component modules
│   │   ├── Navigation.jsx     # Global top navbar with guest dropdown & staff portal link
│   │   ├── Footer.jsx         # Global footer with links, copyright & newsletter
│   │   ├── ErrorBoundary.jsx  # Luxury React error boundary fallback container
│   │   └── ProtectedRoute.jsx # Route guard verifying authentication & role permissions
│   │
│   ├── context/               # Global React contexts
│   │   └── AuthContext.jsx    # Session state, login, register, logout, profile update
│   │
│   ├── services/              # API clients & network helpers
│   │   └── api.js             # Axios client with withCredentials: true & base URL
│   │
│   └── pages/                 # Full-page route views
│       ├── Home.jsx           # Public hero, featured suites, luxury amenities preview
│       ├── Rooms.jsx          # Public catalog with category filters & nightly rates
│       ├── RoomDetails.jsx    # Suite specifications, gallery & date reservation widget
│       ├── About.jsx          # Resort history, hospitality philosophy, guest services
│       ├── Login.jsx          # Guest login page with 1-click demo guest autofill
│       ├── Register.jsx       # Guest registration form with validation
│       ├── Dashboard.jsx      # Guest personal dashboard & reservation tracking
│       ├── AdminLogin.jsx     # Dedicated staff portal login with 1-click admin autofill
│       ├── Admin.jsx          # Central Command Dashboard (7 KPI cards, ledger, provisioning, users)
│       └── NotFound.jsx       # 404 luxury error page with return home button
```

---

## 3. Backend Structure (`server/`)

```
server/
├── index.js                   # Server entry point: loads .env, connects to Atlas, starts listener
├── app.js                     # Express app instance, global middleware, router mounting & error handler
├── package.json               # Backend dependencies (Express, Mongoose, JWT, bcrypt, cors)
├── .env                       # Local environment variables (PORT, MONGO_URI, JWT_SECRET)
│
├── config/                    # Database connection helpers
│   └── db.js                  # Mongoose connection logic with retry handling
│
├── models/                    # Mongoose 9 ODM Schemas & Data Models
│   ├── User.js                # Guest and administrator accounts schema & bcrypt methods
│   ├── Room.js                # Suite catalog inventory schema with amenities & images
│   ├── Booking.js             # Reservation records schema with dates, pricing & status
│   └── Payment.js             # Transaction records schema with status & payment methods
│
├── controllers/               # Business logic & request processing
│   ├── authController.js      # User registration, login, logout, profile fetch & update
│   ├── roomController.js      # Public room queries, room creation, update & deletion
│   ├── bookingController.js   # Booking creation with date overlap check, ledger, cancellation
│   └── userController.js      # User directory fetch, role promotion, user deletion
│
├── routes/                    # Modular Express URL Routers
│   ├── authRoutes.js          # Routes for /api/auth
│   ├── roomRoutes.js          # Routes for /api/rooms
│   ├── bookingRoutes.js       # Routes for /api/bookings
│   └── userRoutes.js          # Routes for /api/users
│
├── middleware/                # Express request processing middleware
│   ├── authMiddleware.js      # JWT verification (protect) & admin role gate (adminOnly)
│   └── errorMiddleware.js     # Global normalized error handling & status code assignment
│
└── scripts/                   # Idempotent database seeders & maintenance utilities
    ├── seedRooms.js           # Seeds 8 realistic luxury suites with _seedId upsert keys
    ├── seedAdmin.js           # Seeds default admin@hotelpro.com & promotes staff
    └── seedGuest.js           # Seeds demo guest@hotelpro.com with active sample booking
```
