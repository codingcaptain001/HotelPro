# Schema Reference

## 1. Quick Reference: Model Fields & Types

### Collection: `users`
| Field | Type | Validation / Rules | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated PK | Unique MongoDB document identifier |
| `name` | `String` | Required, Trimmed | User's full name |
| `email` | `String` | Required, Unique, Lowercase, Regex | Validated user email address |
| `passwordHash` | `String` | Required | 10-round salted bcrypt hash |
| `role` | `String` | Enum: `['guest', 'admin']` (Default: `'guest'`) | System access role |
| `isAdmin` | `Boolean` | Default: `false` | Synchronized flag for role |
| `phone` | `String` | Optional, Trimmed | Contact phone number |
| `createdAt` | `Date` | Managed by Mongoose | Creation timestamp |
| `updatedAt` | `Date` | Managed by Mongoose | Modification timestamp |

### Collection: `rooms`
| Field | Type | Validation / Rules | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated PK | Unique suite document identifier |
| `name` | `String` | Required, Trimmed | Suite title (e.g. "Sunset Ocean Villa") |
| `roomType` | `String` | Required | Category tier (Deluxe Suite, etc.) |
| `description` | `String` | Required | Public narrative & specifications |
| `pricePerNight` | `Number` | Required, Min: 0 | Nightly rate in USD |
| `capacity` | `Number` | Required, Min: 1 | Max guest capacity |
| `status` | `String` | Enum: `['available', 'maintenance']` (Default: `'available'`) | Operational status |
| `amenities` | `[String]` | Array of strings | Amenity tag list |
| `images` | `[String]` | Array of URLs | Photo gallery links |
| `createdAt` | `Date` | Managed by Mongoose | Creation timestamp |
| `updatedAt` | `Date` | Managed by Mongoose | Modification timestamp |

### Collection: `bookings`
| Field | Type | Validation / Rules | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated PK | Unique booking document identifier |
| `bookingReference` | `String` | Required, Unique, Uppercase | Public booking reference code (e.g. `BK-...`) |
| `user` | `ObjectId` | Ref: `'User'`, Required | Guest who booked the suite |
| `room` | `ObjectId` | Ref: `'Room'`, Required | Reserved suite inventory ID |
| `checkInDate` | `Date` | Required | Arrival date |
| `checkOutDate` | `Date` | Required | Departure date |
| `guestCount` | `Number` | Required, Min: 1 | Number of guests |
| `numberOfNights` | `Number` | Required, Min: 1 | Length of stay |
| `totalPrice` | `Number` | Required, Min: 0 | Total cost |
| `status` | `String` | Enum: `['confirmed', 'pending', 'cancelled']` (Default: `'confirmed'`) | Current reservation status |
| `paymentStatus` | `String` | Enum: `['unpaid', 'paid', 'refunded']` (Default: `'paid'`) | Financial status |
| `createdAt` | `Date` | Managed by Mongoose | Creation timestamp |
| `updatedAt` | `Date` | Managed by Mongoose | Modification timestamp |
