# Relationships & Indexes

## 1. Relational Model in MongoDB Document Store

HotelPro models relationships between collections using Mongoose `ObjectId` references (normalized approach) combined with `.populate()` at query time.

### Foreign Keys
- `Booking.user` $\rightarrow$ references `User._id`
- `Booking.room` $\rightarrow$ references `Room._id`
- `Payment.user` $\rightarrow$ references `User._id`
- `Payment.booking` $\rightarrow$ references `Booking._id`

### Population Example (`bookingController.js`)
```javascript
const bookings = await Booking.find()
  .populate('user', 'name email phone')
  .populate('room', 'name roomType pricePerNight images')
  .sort({ createdAt: -1 });
```
This joins the related documents into a single JSON response, supplying the admin ledger with guest contact details and room metadata in one query.

---

## 2. Indexing Strategy

To maintain sub-50ms query times across growing booking ledgers, the following indexes are declared:

| Collection | Indexed Field | Index Type | Purpose |
| :--- | :--- | :--- | :--- |
| `users` | `email` | Unique Index (`1`) | Enforces unique email constraint and accelerates login queries |
| `rooms` | `_seedId` | Unique Sparse (`1`) | Accelerates idempotent upserts during database seeding |
| `bookings` | `bookingReference` | Unique Index (`1`) | Accelerates lookup by public reference code |
| `bookings` | `room`, `checkInDate`, `checkOutDate` | Compound Index | High-speed date overlap conflict resolution |
| `bookings` | `user` | Single Index (`1`) | Accelerates guest `/my-bookings` dashboard retrieval |
