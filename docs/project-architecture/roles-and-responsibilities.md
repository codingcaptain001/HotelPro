# Roles and Responsibilities

This document defines the roles, permissions, and security responsibilities within the **HotelPro** hotel booking and management system. These definitions reflect the actual implementations enforced by the backend architecture and REST API.

---

## 1. Introduction
HotelPro relies on a strict Role-Based Access Control (RBAC) model to distinguish between general users (Guests/Customers) and platform managers (Administrators). The system employs robust server-side validation to ensure that users cannot escalate privileges or access unauthorized data.

---

## 2. Customer / Ordinary User
The **Customer** (or Guest) role is assigned to all new users by default upon registration. Customers have access to the public-facing features of the hotel application and restricted access to their personal data.

### 2.1 Responsibilities and Capabilities
- **Authentication**: 
  - Register using name, email, password, and phone number (`Implemented`).
  - Log in securely using an email and password to receive a JWT session (`Implemented`).
  - Log out and securely end the authenticated session (`Implemented`).
- **Room Browsing**:
  - Browse the global inventory of rooms (`Implemented`).
  - View room descriptions, high-quality images, amenities, capacity limits, and pricing (`Implemented`).
  - Search and filter available rooms (`Implemented`).
- **Booking Management**:
  - Select an available room, specify check-in/check-out dates, and create a reservation (`Implemented`).
  - View personal booking history and reservation details. Guests can only access bookings associated with their own `_id` (`Implemented` via backend `getMyBookings` API; Frontend UI Planned).
  - Cancel eligible bookings, provided the check-in date has not passed (`Implemented`).

### 2.2 Strict Restrictions
- Customers **cannot** create, edit, or delete room inventory.
- Customers **cannot** view, modify, or cancel reservations belonging to other users.
- Customers **cannot** access administrative endpoints, dashboards, or user lists.
- Customers **cannot** escalate their role to an administrator via standard API endpoints.

---

## 3. Administrator
The **Administrator** role is assigned exclusively to authorized hotel staff. Administrators manage the core infrastructure of the hotel platform. 

### 3.1 Responsibilities and Capabilities
- **Authentication**: 
  - Authenticate through the standard secure login mechanism. Administrative capabilities are only unlocked after the server validates the `role: 'admin'` claim embedded in the JWT (`Implemented`).
- **Room Management**:
  - Add new hotel rooms to the platform database, defining capacities, amenities, and pricing (`Implemented` via backend POST `/api/rooms` API; Frontend UI Planned).
  - Maintain accurate room inventory status. *(Note: Editing and deleting existing rooms are planned features and not yet supported in the current API version).*
- **Booking & User Management**:
  - View and manage reservations made by guests *(Planned)*.
  - View registered users and platform metrics *(Planned)*.

---

## 4. Permissions Comparison Table

| Feature / Action | Customer (Guest) | Administrator | Implementation Status |
| :--- | :---: | :---: | :--- |
| **View Public Rooms** | ✅ | ✅ | Implemented |
| **Register & Login** | ✅ | ✅ | Implemented |
| **Create Booking** | ✅ | ✅ | Implemented |
| **View Own Bookings** | ✅ | ✅ | Implemented (Backend API) |
| **Cancel Own Booking** | ✅ | ✅ | Implemented (Backend API) |
| **Create New Room** | ❌ | ✅ | Implemented (Backend API) |
| **Edit/Delete Room** | ❌ | ❌ | Planned |
| **View All Users/Bookings**| ❌ | ❌ | Planned |
| **Change User Roles** | ❌ | ❌ | Planned |

---

## 5. Authorization and Security Responsibilities

### 5.1 Authentication vs. Authorization
- **Authentication** answers *"Who are you?"* HotelPro verifies identity using an email and password combination, granting a JSON Web Token (JWT) upon success.
- **Authorization** answers *"What are you allowed to do?"* Once authenticated, the server inspects the JWT payload (specifically the `role` attribute) and compares the user's `_id` against resource ownership to determine access rights.

### 5.2 Implementation Details
- **JWT Protection**: The application uses HttpOnly, secure cookies to store the JWT. This prevents client-side scripts from accessing the token, neutralizing Cross-Site Scripting (XSS) risks.
- **Enforcing Permissions**:
  - The `protect` middleware intercepts requests, extracts the JWT, decodes the `userId`, and attaches the User object to the request context.
  - The `admin` middleware subsequently verifies `req.user.role === 'admin'`. If this fails, a `401 Unauthorized` response is returned.
- **Ownership Checks**: When a user attempts to cancel a booking (`PUT /api/bookings/:id/cancel`), the backend strictly compares `booking.user.toString()` against `req.user._id.toString()`. 
- **Secret Protection & Hashing**: Passwords are hashed using `bcryptjs` with a secure salt round before database insertion. All sensitive keys (like `JWT_SECRET` and `MONGO_URI`) are injected strictly via server-side environment variables and excluded from source control.
- **Concurrency**: Double-booking is mitigated strictly by the backend logic, which runs an overlap detection query against existing active reservations before committing a new booking to the database.

---

## 6. Conclusion
The current RBAC implementation successfully protects administrative routes and ensures guest data privacy. While the core security mechanisms (JWT, bcrypt, ownership checks) are fully functional, administrative capabilities remain limited to room creation until the comprehensive admin dashboard UI and management APIs are developed in the next phase.
