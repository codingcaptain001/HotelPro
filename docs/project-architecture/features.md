# HotelPro — Features Documentation

This document outlines the complete feature set for the HotelPro hotel booking and management system, clearly distinguishing between fully implemented, partially implemented, and planned features.

## 1. Project Overview
HotelPro is a comprehensive MERN stack (MongoDB, Express.js, React, Node.js) application designed to facilitate seamless hotel room reservations for guests and powerful inventory management for administrators.

## 2. User Features
- **User Authentication**: Guests can register with their name, email, phone number, and securely hashed password. Login is handled via JWT-based authentication with HTTP-only cookies.
- **User Dashboard**: A personalized space for guests to view their past and upcoming bookings, and cancel eligible reservations. *(Frontend UI is Planned)*
- **Room Browsing**: Visitors can browse all available rooms, view high-quality images, read descriptions, and filter by room name or type.
- **Booking Management**: Authenticated users can select check-in and check-out dates, automatically calculate the total estimated cost based on the room's price per night, and submit booking requests. The system prevents overlapping dates for the same room.

## 3. Administrator Features
- **Admin Authentication**: Secure JWT role-based login to access protected admin routes.
- **Admin Dashboard**: A central hub to view aggregate metrics such as total rooms, bookings, and revenue. *(Frontend UI is Planned)*
- **Booking Management**: Administrators can view all guest bookings and manage their statuses. *(Frontend UI is Planned)*
- **Room Management**: Administrators have the authorization to add new rooms to the inventory via protected API routes. Editing and deleting rooms via UI is planned.
- **User Management**: Administrators can view registered users and their roles. *(Frontend UI is Planned)*

## 4. Authentication and Security Features
- **Secure Password Hashing**: Passwords are never stored in plaintext; `bcryptjs` is used for one-way hashing before database insertion.
- **Protected Sessions**: Authentication state is managed using JWTs stored securely in HTTP-only cookies to mitigate XSS attacks.
- **Backend Authorization**: Role-based access control (RBAC) middleware (`admin` role check) strictly protects administrative operations (like room creation).

## 5. Booking and Availability Features
- **Double-Booking Prevention**: The backend strictly validates incoming booking dates against existing non-cancelled reservations to guarantee a room cannot be double-booked.
- **Capacity Limits**: Booking requests validate the requested guest count against the specific room's maximum capacity.
- **Secure Cancellation**: The backend cancellation endpoint strictly verifies ownership (the user must own the booking or be an admin) and enforces temporal constraints (bookings cannot be cancelled after the check-in date has passed).

## 6. Responsive UI Features
- **Responsive Navigation**: A dynamic navigation bar that adapts to desktop and mobile views, updating links based on the user's authentication and role status.
- **Premium Design Aesthetics**: The interface utilizes an elegant navy, ivory, and warm neutral color palette, featuring consistent typography and styling via Bootstrap 5 and custom CSS.
- **Feedback States**: Forms and data-fetching components implement clear loading spinners, empty state fallbacks, and toast/alert error notifications.

---

## 7. Feature Implementation Status

| Feature | Status | Evidence / File References |
| :--- | :--- | :--- |
| **User Registration & Login** | Implemented | `client/src/pages/Register.jsx`, `Login.jsx`, `server/src/controllers/authController.js` |
| **JWT & Role-based Auth** | Implemented | `server/src/middleware/auth.js`, `client/src/context/AuthContext.jsx` |
| **Room Browsing & Details** | Implemented | `client/src/pages/Rooms.jsx`, `RoomDetails.jsx`, `server/src/controllers/roomController.js` |
| **Booking Creation & Validation** | Implemented | `server/src/controllers/bookingController.js` (Date overlap check), `RoomDetails.jsx` |
| **Booking Cancellation Logic** | Implemented | `server/src/controllers/bookingController.js` (`cancelBooking` method) |
| **Admin Room Creation API** | Implemented | `server/src/routes/roomRoutes.js` (POST `/api/rooms` with `admin` middleware) |
| **Responsive UI & Navigation** | Implemented | `client/src/components/Navigation.jsx`, `client/src/index.css` |
| **Guest Dashboard UI** | Planned | Backend `getMyBookings` exists; React view pending |
| **Admin Dashboard UI** | Planned | React view and comprehensive admin APIs pending |
| **Payment Gateway Integration** | Planned | Mock `Payment.js` model exists; Razorpay test integration pending |

---

## 8. Planned Enhancements & Known Limitations
- The **Guest Dashboard** and **Admin Dashboard** React views are currently placeholders. The backend supports fetching user-specific bookings, but the frontend needs to be built to consume this data and expose the cancellation button.
- Administrative capabilities to edit and delete rooms, as well as manage users, need corresponding backend endpoints and frontend interfaces.
- The **Payment processing** flow relies on the mock `Payment` model and does not yet interact with the live Razorpay API. Real webhook validation will be added in a future phase.
