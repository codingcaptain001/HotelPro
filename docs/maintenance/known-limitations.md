# Known Limitations & Roadmap

## 1. Known Architectural Limitations

1. **Payment Gateway Integration**:
   - The `Payment` schema and transactional states are modeled, but live integration with Razorpay or Stripe is pending production merchant account credentials.
2. **Real-Time WebSockets**:
   - Updates across multiple concurrent administrator browser tabs currently rely on manual sync buttons or page refresh rather than real-time Socket.io WebSockets.
3. **Automated End-to-End Test Suite**:
   - The application relies on TypeScript/Vite compilation checks and manual verification. A Cypress or Playwright end-to-end test suite is scheduled for future milestones.

---

## 2. Production Roadmap

- [ ] Integrate Razorpay / Stripe live checkout with webhook signature verification.
- [ ] Add Redis caching layer for high-throughput public room catalog queries.
- [ ] Implement automated guest email booking confirmations using SendGrid or AWS SES.
- [ ] Add multilingual localization support (i18n).
