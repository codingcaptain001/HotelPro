# Testing & Verification Guide

## 1. Overview

Before deploying or committing changes, verify application stability using build validation, API endpoint health checks, and end-to-end user journey checks.

---

## 2. Frontend Build Verification

To verify that all TypeScript types, React JSX markup, and Vite bundling succeed without errors:

```bash
cd client
npm run build
```
**Expected Outcome**:
- `✓ built in ~2.15s`
- Zero syntax or compilation errors.
- Bundle assets generated in `client/dist/`.

---

## 3. Backend API Verification

Test the backend health and database connectivity using `curl`:

### Health / Public Room Catalog
```bash
curl -s http://localhost:5000/api/rooms | head -n 20
```
**Expected Outcome**: Returns HTTP 200 with JSON array of suites.

### Authentication & Cookie Check
```bash
curl -i -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hotelpro.com","password":"admin123"}'
```
**Expected Outcome**: Returns HTTP 200 with `Set-Cookie: jwt=...; HttpOnly` header and user payload.

---

## 4. Manual Verification Checklist

- [ ] Guest Registration & Login at `/login` and `/register`.
- [ ] Room filtering and suite detail inspection at `/rooms` and `/rooms/:id`.
- [ ] Booking creation and double-booking conflict rejection.
- [ ] Admin Dashboard login at `/admin/login`.
- [ ] 7 KPI metric card live computation at `/admin/overview`.
- [ ] Room provisioning at `/admin/add-room` with live guest card preview.
- [ ] Printable guest invoice generation in Bookings Ledger.
