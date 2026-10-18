# Payment Integration & Financial Modeling

## 1. Current State: Simulated / Direct Payment Modeling

HotelPro currently features an integrated data model (`server/models/Payment.js`) and direct transactional confirmation:
- When a guest completes a booking, the transaction is recorded with `paymentStatus: 'paid'` (or `'unpaid'` depending on flow).
- The total transaction amount is computed atomically as:
  $$\text{Total Amount} = \text{Room Nightly Rate} \times \text{Number of Nights}$$
- The financial metric is aggregated live into the Admin Dashboard's **Gross Booking Revenue** KPI.

---

## 2. Payment Data Model (`server/models/Payment.js`)

```javascript
const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, default: 'card' },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'completed' },
  transactionId: { type: String, default: () => 'TXN-' + Date.now() }
}, { timestamps: true });
```

---

## 3. Production Roadmap: Gateway Integration (Razorpay / Stripe)

For live payment processing in production:
1. **Order Creation (`POST /api/payments/create-order`)**:
   - Backend calls payment gateway API (e.g. Razorpay Orders API / Stripe PaymentIntents) with amount and currency.
2. **Client Checkout Modal**:
   - Frontend invokes SDK checkout modal with `order_id`.
3. **Webhook Verification (`POST /api/payments/verify`)**:
   - Gateway sends cryptographically signed signature back to server.
   - Server verifies signature using HMAC SHA256 before updating `booking.paymentStatus = 'paid'`.
