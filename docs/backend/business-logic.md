# Business Logic & Algorithms

## 1. Double-Booking Conflict Prevention Engine

The core operational guarantee of HotelPro is the **Double-Booking Conflict Prevention Engine** implemented in `server/controllers/bookingController.js`.

### The Mathematical Date Overlap Formula
Two date ranges `[A_start, A_end]` and `[B_start, B_end]` overlap if and only if:
$$\text{Overlap} \iff A_{\text{start}} < B_{\text{end}} \land A_{\text{end}} > B_{\text{start}}$$

### MongoDB Mongoose Implementation
When a guest requests a booking for a specific `roomId` between `checkInDate` and `checkOutDate`:

```javascript
const existingConflict = await Booking.findOne({
  room: roomId,
  status: { $ne: 'cancelled' }, // Exclude cancelled reservations
  checkInDate: { $lt: requestedCheckOutDate },
  checkOutDate: { $gt: requestedCheckInDate }
});

if (existingConflict) {
  return res.status(400).json({
    message: 'This room is already booked for the selected dates.'
  });
}
```

### Why Exclusion of Cancelled Stays is Critical
If a guest cancels a booking, its status becomes `cancelled`. Because the conflict query explicitly checks `status: { $ne: 'cancelled' }`, the dates immediately unlock and become available for other guests to reserve without requiring manual administrative database cleanup.

---

## 2. Operations KPI Metric Calculations (`Admin.jsx`)

The 7 KPI cards displayed in the Central Command dashboard are calculated in real time directly from live Atlas queries:

1. **Total Rooms**: `rooms.length`
2. **Available Rooms**: `rooms.filter(r => r.status === 'available').length`
3. **Occupancy Rate**: $\frac{\text{Total Rooms} - \text{Available Rooms}}{\text{Total Rooms}} \times 100\%$
4. **Total Bookings**: `bookings.length`
5. **Confirmed Bookings**: `bookings.filter(b => b.status === 'confirmed').length`
6. **Confirmation Rate**: $\frac{\text{Confirmed Bookings}}{\text{Total Bookings}} \times 100\%$
7. **Cancelled Bookings**: `bookings.filter(b => b.status === 'cancelled').length`
8. **Registered Users**: `users.length`
9. **Gross Booking Revenue**:
   $$\sum_{b \in \text{Confirmed Bookings}} (\text{b.totalPrice} \lor \text{b.totalAmount} \lor 0)$$
