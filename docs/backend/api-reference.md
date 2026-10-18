# REST API Reference

All requests must use `Content-Type: application/json`. Protected endpoints require an active `jwt` HTTP-only cookie or an `Authorization: Bearer <token>` header.

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register`
Creates a new guest user account and returns JWT credentials.
- **Access**: Public
- **Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "phone": "+1 (555) 123-4567"
}
```
- **Success Response (201 Created)**:
```json
{
  "_id": "6712b7a9...",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "role": "guest",
  "isAdmin": false,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### `POST /api/auth/login`
Authenticates existing credentials, sets the `jwt` HTTP-only cookie, and returns user data.
- **Access**: Public
- **Request Body**:
```json
{
  "email": "guest@hotelpro.com",
  "password": "guest123"
}
```
- **Success Response (200 OK)**:
```json
{
  "_id": "6712b7a9...",
  "name": "Demo Guest",
  "email": "guest@hotelpro.com",
  "role": "guest",
  "isAdmin": false,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### `POST /api/auth/logout`
Clears the `jwt` HTTP-only cookie.
- **Access**: Public
- **Success Response (200 OK)**:
```json
{ "message": "Logged out successfully" }
```

### `GET /api/auth/profile`
Retrieves the profile of the currently authenticated user.
- **Access**: Authenticated (`protect`)
- **Success Response (200 OK)**:
```json
{
  "_id": "6712b7a9...",
  "name": "Demo Guest",
  "email": "guest@hotelpro.com",
  "role": "guest",
  "isAdmin": false,
  "phone": "+1 (555) 019-2834"
}
```

---

## 2. Accommodations Endpoints (`/api/rooms`)

### `GET /api/rooms`
Retrieves the inventory catalog of suites.
- **Access**: Public
- **Query Parameters**:
  - `roomType` (string): Filter by type (e.g. `Deluxe Suite`)
  - `status` (string): Filter by availability (e.g. `available`)
- **Success Response (200 OK)**:
```json
[
  {
    "_id": "6ace1b91b928405cbdad8c8f",
    "name": "Ocean Breeze Deluxe Suite",
    "roomType": "Deluxe Suite",
    "description": "Perched on the top floor with panoramic ocean views...",
    "pricePerNight": 349,
    "capacity": 2,
    "status": "available",
    "amenities": ["King Bed", "Ocean View Balcony", "High-Speed Wi-Fi"],
    "images": ["https://images.unsplash.com/photo-1590490360182-c33d57733427..."]
  }
]
```

### `GET /api/rooms/:id`
Retrieves detailed specifications for a specific suite.
- **Access**: Public

### `POST /api/rooms`
Provisions a new suite to the accommodations catalog.
- **Access**: Admin Only (`protect`, `adminOnly`)
- **Request Body**:
```json
{
  "name": "Royal Oceanfront Penthouse 501",
  "roomType": "Deluxe Suite",
  "description": "Duplex penthouse with double-height ceilings...",
  "pricePerNight": 480,
  "capacity": 3,
  "status": "available",
  "amenities": ["Ocean View", "Private Balcony", "King Bed"],
  "images": ["https://images.unsplash.com/photo-1590490360182-c33d57733427..."]
}
```
- **Success Response (201 Created)**: Returns the newly saved Room document.

### `PUT /api/rooms/:id`
Updates existing room details, pricing, status, or amenities.
- **Access**: Admin Only (`protect`, `adminOnly`)

### `DELETE /api/rooms/:id`
Removes a room from the inventory catalog.
- **Access**: Admin Only (`protect`, `adminOnly`)

---

## 3. Bookings Endpoints (`/api/bookings`)

### `POST /api/bookings`
Creates a new reservation with double-booking conflict verification.
- **Access**: Authenticated (`protect`)
- **Request Body**:
```json
{
  "room": "6ace1b91b928405cbdad8c8f",
  "checkInDate": "2026-11-01T00:00:00.000Z",
  "checkOutDate": "2026-11-04T00:00:00.000Z",
  "guestCount": 2,
  "guestName": "Jane Doe",
  "phone": "+1 555-1234"
}
```
- **Conflict Error (400 Bad Request)**:
```json
{ "message": "This room is already booked for the selected dates." }
```
- **Success Response (201 Created)**: Returns confirmed Booking document with `bookingReference`.

### `GET /api/bookings/my-bookings`
Retrieves all bookings made by the currently authenticated guest.
- **Access**: Authenticated (`protect`)

### `GET /api/bookings`
Retrieves the complete hotel reservations ledger with populated `user` and `room` data.
- **Access**: Admin Only (`protect`, `adminOnly`)

### `PUT /api/bookings/:id/status`
Updates reservation status (`confirmed`, `pending`, `cancelled`).
- **Access**: Admin Only (`protect`, `adminOnly`)

### `DELETE /api/bookings/:id`
Cancels an existing reservation.
- **Access**: Authenticated (`protect` — guest can cancel own booking, admin can cancel any booking)

---

## 4. Users Directory Endpoints (`/api/users`)

### `GET /api/users`
Retrieves directory of all registered guest and staff accounts.
- **Access**: Admin Only (`protect`, `adminOnly`)

### `PUT /api/users/:id/role`
Updates user privilege between `guest` and `admin`.
- **Access**: Admin Only (`protect`, `adminOnly`)
- **Request Body**:
```json
{ "role": "admin" }
```
