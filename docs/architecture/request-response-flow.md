# Request-Response Flow

## 1. Overview

This document illustrates the end-to-end lifecycle of HTTP transactions between the React client, Express API, and MongoDB Atlas database.

---

## 2. Authentication Flow (Login & Session Verification)

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Guest User
    participant Browser as React Frontend (Login.jsx)
    participant AuthContext as AuthContext.jsx
    participant API as Express API (/api/auth/login)
    participant DB as MongoDB Atlas (users collection)

    Guest->>Browser: Enters email and password, clicks "Sign In"
    Browser->>AuthContext: login(email, password)
    AuthContext->>API: POST /api/auth/login { email, password }
    API->>DB: User.findOne({ email })
    DB-->>API: Returns user document with passwordHash
    API->>API: bcrypt.compare(password, user.passwordHash)
    
    alt Password Invalid
        API-->>AuthContext: 401 Unauthorized { message: "Invalid email or password" }
        AuthContext-->>Browser: Sets error state
        Browser-->>Guest: Displays red alert banner
    else Password Valid
        API->>API: jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '30d' })
        API-->>AuthContext: 200 OK + Set-Cookie: jwt=token; HttpOnly + JSON { _id, name, email, role, token }
        AuthContext->>AuthContext: setUser(data), localStorage.setItem('user', JSON.stringify(data))
        AuthContext-->>Browser: Redirects to /dashboard (or /admin if admin)
        Browser-->>Guest: Renders authenticated portal
    end
```

---

## 3. Room Reservation Flow with Double-Booking Conflict Prevention

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Guest User
    participant Browser as React Client (BookRoom / RoomDetails)
    participant API as Express API (/api/bookings)
    participant DB as MongoDB Atlas

    Guest->>Browser: Selects Check-In, Check-Out, Guests, clicks "Confirm Reservation"
    Browser->>API: POST /api/bookings { roomId, checkInDate, checkOutDate, guestCount, guestName, phone } (with JWT Cookie)
    
    API->>API: protect middleware verifies JWT and attaches req.user
    API->>DB: Room.findById(roomId)
    DB-->>API: Returns room specifications

    API->>API: Check capacity limit (guestCount <= room.capacity)
    
    API->>DB: Booking.find({ room: roomId, status: { $ne: 'cancelled' }, checkInDate: { $lt: reqCheckOut }, checkOutDate: { $gt: reqCheckIn } })
    DB-->>API: Returns existing active bookings overlapping requested dates

    alt Date Overlap Detected (Double-Booking Conflict)
        API-->>Browser: 400 Bad Request { message: "This room is already booked for the selected dates." }
        Browser-->>Guest: Displays reservation date conflict alert
    else No Overlap Detected
        API->>API: Generate unique bookingReference (e.g. BK-MVEBDJU2-GST)
        API->>API: Calculate numberOfNights and totalPrice = room.pricePerNight * numberOfNights
        API->>DB: Booking.create({ bookingReference, user: req.user._id, room, checkInDate, checkOutDate, totalPrice, status: 'confirmed' })
        DB-->>API: Returns saved booking document
        API-->>Browser: 201 Created { message: "Booking confirmed successfully", booking }
        Browser-->>Guest: Displays booking confirmation receipt & modal
    end
```

---

## 4. Admin Suite Provisioning Flow (`/admin/add-room`)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrator
    participant Browser as Admin.jsx (Add Room Tab)
    participant API as Express API (/api/rooms)
    participant DB as MongoDB Atlas

    Admin->>Browser: Types title, selects category, toggles luxury amenity pills, inputs photo URLs
    Browser->>Browser: Live photo asset strip detects URLs and renders thumbnail gallery
    Browser->>Browser: Sticky Live Guest Card Preview simulates public appearance in real time
    Admin->>Browser: Clicks "Publish Suite to Inventory"
    Browser->>API: POST /api/rooms { name, roomType, description, pricePerNight, capacity, status, amenities, images } (with Admin JWT)
    API->>API: protect middleware verifies JWT
    API->>API: adminOnly middleware confirms req.user.role === 'admin'
    API->>DB: Room.create(payload)
    DB-->>API: Returns newly created Room document
    API-->>Browser: 201 Created { message: "Room created successfully", room }
    Browser->>Browser: Dispatches fetchRooms() and re-routes to /admin/rooms catalog
    Browser-->>Admin: Displays green success banner and refreshed accommodations catalog
```
