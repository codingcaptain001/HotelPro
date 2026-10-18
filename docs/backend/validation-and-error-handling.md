# Validation & Error Handling

## 1. Input Validation Architecture

Validation occurs at two coordinated boundaries:
1. **Controller Level**: Business constraints (e.g. `pricePerNight >= 0`, `guestCount <= room.capacity`, date ranges where `checkOutDate > checkInDate`).
2. **Mongoose Schema Level**: Data type integrity, regex patterns (email formatting), required field constraints, and enum restrictions.

---

## 2. Common Validation Rules

### Email Validation
```javascript
// User.js regex validation
match: [
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  'Please provide a valid email address'
]
```

### Room Capacity & Nightly Rate Validation
```javascript
// Room.js constraints
pricePerNight: {
  type: Number,
  required: [true, 'Please specify the price per night'],
  min: [0, 'Price per night cannot be negative']
},
capacity: {
  type: Number,
  required: [true, 'Please specify the room capacity'],
  min: [1, 'Capacity must be at least 1 guest']
}
```

---

## 3. Standardized HTTP Error Status Codes

| Status Code | Meaning | Typical Trigger |
| :--- | :--- | :--- |
| **400 Bad Request** | Invalid payload | Missing required fields, date overlap conflict, checkout <= checkin |
| **401 Unauthorized** | Missing or invalid auth | Invalid password, expired JWT, missing session cookie |
| **403 Forbidden** | Insufficient permissions | Regular guest attempting to invoke an `/api/admin` endpoint |
| **404 Not Found** | Resource missing | Requested room ID or booking reference does not exist in Atlas |
| **500 Server Error** | Unexpected exception | Database connectivity interruption, unhandled runtime exception |
