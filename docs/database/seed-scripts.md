# Database Seed Scripts

## 1. Overview

HotelPro provides three idempotent seed scripts located in `server/scripts/`. Each script can be executed repeatedly without causing duplicate records, data corruption, or crashing.

---

## 2. Seed Script Inventory

### 1. `seedRooms.js` (`npm run seed:rooms`)
- **Path**: `server/scripts/seedRooms.js`
- **Purpose**: Populates the accommodations catalog with 8 luxury suites covering 7 distinct category tiers (Deluxe Suite, Executive Suite, Ocean Villa, Single Room, Family Suite, Penthouse, Twin Room).
- **Idempotency**: Utilizes an internal `_seedId` field. When executed, Mongoose performs an `findOneAndUpdate(..., { upsert: true })`. If a room already exists, its specifications, pricing, and images are updated without deleting existing guest bookings that reference its ObjectId.

### 2. `seedAdmin.js` (`npm run seed:admin`)
- **Path**: `server/scripts/seedAdmin.js`
- **Purpose**: Verifies that `admin@hotelpro.com` exists with password `admin123`. If missing, creates the administrator with `role: 'admin'` and `isAdmin: true`. Also promotes any designated administrator email accounts.

### 3. `seedGuest.js` (`npm run seed:guest`)
- **Path**: `server/scripts/seedGuest.js`
- **Purpose**: Verifies that `guest@hotelpro.com` exists with password `guest123` and `role: 'guest'`. If the guest has no active reservations, automatically provisions a confirmed sample booking (`BK-...-GST`) so the `/dashboard` view demonstrates a live guest reservation immediately.

---

## 3. Running All Seed Scripts

From the repository root:
```bash
npm run seed:rooms
npm run seed:admin
npm run seed:guest
```
All scripts output clean console logs and exit with code `0` on success or code `1` on error.
