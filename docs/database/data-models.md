# Data Models

## 1. Overview

HotelPro manages four primary collections inside MongoDB Atlas via Mongoose 9 models located in `server/models/`:
- `User`: Guest and staff accounts.
- `Room`: Accommodations catalog and unit inventory.
- `Booking`: Reservation contracts and operational statuses.
- `Payment`: Financial transaction records.

---

## 2. Entity-Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Booking : "reserves"
    Room ||--o{ Booking : "is booked in"
    User ||--o{ Payment : "submits"
    Booking ||--o| Payment : "is paid by"

    User {
        ObjectId _id PK
        string name
        string email UK
        string passwordHash
        string role "guest | admin"
        boolean isAdmin
        string phone
        date createdAt
        date updatedAt
    }

    Room {
        ObjectId _id PK
        string name
        string roomType
        string description
        number pricePerNight
        number capacity
        string status "available | maintenance"
        array amenities
        array images
        date createdAt
        date updatedAt
    }

    Booking {
        ObjectId _id PK
        string bookingReference UK
        ObjectId user FK
        ObjectId room FK
        date checkInDate
        date checkOutDate
        number guestCount
        number numberOfNights
        number totalPrice
        string status "confirmed | pending | cancelled"
        string paymentStatus "unpaid | paid | refunded"
        date createdAt
        date updatedAt
    }

    Payment {
        ObjectId _id PK
        ObjectId user FK
        ObjectId booking FK
        number amount
        string paymentMethod
        string status
        string transactionId
        date createdAt
    }
```

---

## 3. Pre-Save Lifecycle Hooks (`User.js`)

In `server/models/User.js`, a pre-save hook maintains strict synchronization between `role` and `isAdmin`:

```javascript
userSchema.pre('save', function (next) {
  if (this.isModified('role')) {
    this.isAdmin = this.role === 'admin';
  } else if (this.isModified('isAdmin')) {
    this.role = this.isAdmin ? 'admin' : 'guest';
  }
  if (typeof next === 'function') {
    next();
  }
});
```
This guarantees that promoting a user via `user.role = 'admin'` automatically updates `user.isAdmin = true`, eliminating role desynchronization bugs across the system.
