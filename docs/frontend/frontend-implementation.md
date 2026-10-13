# HotelPro — Frontend Implementation Documentation

This document describes the frontend architecture, page implementations, routing structure, authentication flow, backend API integration, and verification results for the **HotelPro** client application.

---

## 1. Overview & Technology Stack

The HotelPro client is built using modern React on Vite with responsive styling powered by Bootstrap and Lucide React icons.

- **Framework**: React (`v19`), Vite (`v8`)
- **Routing**: React Router (`v7`)
- **Styling**: Bootstrap (`v5.3`) & React Bootstrap (`v2.10`), custom theme in `index.css`
- **Iconography**: Lucide React (`^1.55.0`)
- **HTTP Client**: Axios (`^1.20.0`) configured with `withCredentials: true` to support HTTP-only JWT cookies

---

## 2. Pages & Routing Architecture

All routes are declared in [`client/src/App.jsx`](file:///e:/HotelPro/client/src/App.jsx).

| Route | Page Component | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | `Home` | Public | Hero banner, quick-search bar, live featured rooms, signature amenities, testimonials, and booking call-to-action. |
| `/rooms` | `Rooms` | Public | Searchable and filterable room catalog (by keyword, room type, guest count, and sorting). |
| `/rooms/:id` | `RoomDetails` | Public | High-resolution room gallery, specifications, amenities, and interactive booking widget with live price calculation. |
| `/about` | `About` | Public | Hotel heritage, core hospitality values, location, reception hours, contact details, and interactive FAQ. |
| `/login` | `Login` | Public (Guest) | Sign-in form with email/password validation, error alerts, and post-login redirection to attempted routes. |
| `/register` | `Register` | Public (Guest) | Account creation form with full name, email, phone, password, and confirm-password validation. |
| `/dashboard` | `Dashboard` | Protected (Guest) | Authenticated guest portal displaying profile details, active reservations, status badges, and booking cancellation. |
| `/my-bookings` | `Dashboard` | Protected (Guest) | Alias route to the guest reservations dashboard. |
| `/admin` | `Admin` | Protected (Admin) | Admin portal with room inventory metrics, live rooms table, and "Add New Room" modal. |
| `*` | `NotFound` | Public | Friendly 404 page with navigation actions back to Home and Rooms. |

---

## 3. Authentication & Authorization

Authentication is managed via [`client/src/context/AuthContext.jsx`](file:///e:/HotelPro/client/src/context/AuthContext.jsx):

1. **State Persistence**: User profile (`_id`, `name`, `email`, `role`, `phone`) is stored in `localStorage` under `userInfo` to persist across page refreshes.
2. **Security Guarantee**: Sensitive data—such as plaintext passwords, payment cards, or CVVs—are **never** stored in browser storage.
3. **Session Cookies**: Session tokens are issued by the Express backend as HTTP-only cookies (`jwt`) and sent automatically via `withCredentials: true` on every Axios request.
4. **Route Protection ([`client/src/components/ProtectedRoute.jsx`](file:///e:/HotelPro/client/src/components/ProtectedRoute.jsx))**:
   - Unauthenticated visitors are redirected to `/login` with the target path preserved in `location.state.from`.
   - Non-admin users attempting to navigate to `/admin` receive an explicit "Access Denied" warning.

---

## 4. Backend Endpoints Integrated

| Endpoint | Method | Component / Flow | Payload / Parameters |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | `Register.jsx` | `{ name, email, password, phone }` |
| `/api/auth/login` | `POST` | `Login.jsx` | `{ email, password }` |
| `/api/auth/logout` | `POST` | `Navigation.jsx` | None (clears HTTP-only cookie) |
| `/api/rooms` | `GET` | `Home.jsx`, `Rooms.jsx`, `Admin.jsx` | None (fetches all inventory) |
| `/api/rooms/:id` | `GET` | `RoomDetails.jsx` | `req.params.id` |
| `/api/rooms` | `POST` | `Admin.jsx` (Add Room modal) | `{ name, roomType, description, pricePerNight, capacity, amenities, images, status }` |
| `/api/bookings` | `POST` | `RoomDetails.jsx` (Reserve widget) | `{ room, checkInDate, checkOutDate, guestCount }` |
| `/api/bookings/my` | `GET` | `Dashboard.jsx` (My Bookings) | None (fetches user's bookings with populated room) |
| `/api/bookings/:id/cancel` | `PUT` | `Dashboard.jsx` (Cancel modal) | `req.params.id` |

---

## 5. Backend Limitations Identified

In accordance with strict verification and zero-fabrication standards, the following capabilities are not currently provided by the backend:

1. **Global Booking Management for Admin (`GET /api/bookings/all`)**:
   - The backend currently provides `GET /api/bookings/my` for individual guests. An endpoint to list all bookings across all users for administrators is not yet exposed by `bookingRoutes.js`.
2. **Room Edit/Delete Endpoints (`PUT /api/rooms/:id`, `DELETE /api/rooms/:id`)**:
   - The backend provides room creation (`POST /api/rooms`) and room fetching (`GET /api/rooms`), but does not have controllers for updating or deleting existing rooms.
3. **Live Payment Gateway (Razorpay) Integration**:
   - The application models payment reference data, but actual tokenized payment processing is pending credentials. The frontend safely executes reservations without requesting or storing raw credit card details.

---

## 6. Setup & Verification Commands

### Environment Configuration
The frontend connects to the Express backend via `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
*(A sanitized template is maintained in `client/.env.example`.)*

### Production Build Verification
```bash
cd client
npm run build
```
Result: Bundled cleanly via Vite without compilation or TypeScript errors.

### Local Development
```bash
# Start frontend only:
npm run dev --prefix client

# Start full stack concurrently from project root:
npm run dev
```
