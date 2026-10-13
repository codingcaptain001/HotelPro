# HotelPro — Mongoose Database Setup, Schemas & Lifecycle Guide

This document outlines the database layer architecture, Mongoose configuration, connection lifecycle, data models, schema validations, and local MongoDB verification procedures for **HotelPro**.

---

## 1. Mongoose Installation & Dependencies

Mongoose is configured as the Object Data Modeling (ODM) layer for MongoDB in the Express backend.

- **Package**: `mongoose` (`^9.11.1`)
- **Location**: Declared in [`server/package.json`](file:///e:/HotelPro/server/package.json)
- **Installation Command**:
  ```bash
  cd server
  npm install mongoose
  ```
  The dependency is tracked consistently within [`server/package-lock.json`](file:///e:/HotelPro/server/package-lock.json).

---

## 2. Database URI Configuration

The backend connects to MongoDB using the `MONGO_URI` environment variable.

### Environment Configuration
The database connection string must be defined in `server/.env`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/hotelpro
```

For MongoDB Atlas (cloud cluster):
```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/hotelpro?retryWrites=true&w=majority
```

### Security & Git Policy
- The actual `.env` file containing live credentials is strictly excluded from version control via [`.gitignore`](file:///e:/HotelPro/.gitignore).
- A sanitized template with placeholder values is maintained in [`server/.env.example`](file:///e:/HotelPro/server/.env.example):
  ```env
  NODE_ENV=development
  PORT=5000
  # MongoDB Atlas Connection URI:
  MONGO_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/hotelpro?retryWrites=true&w=majority
  JWT_SECRET=your_jwt_secret_here
  CLIENT_URL=http://localhost:5173
  ```
- No plaintext credentials or secrets are ever committed to the repository.

---

## 3. Database Connection Architecture & Lifecycle

The connection logic resides in [`server/config/db.js`](file:///e:/HotelPro/server/config/db.js) and is consumed by [`server/index.js`](file:///e:/HotelPro/server/index.js).

### Lifecycle Sequence

```
+---------------------------------------------+
| 1. Load Environment Variables (dotenv)      |
+---------------------------------------------+
                       |
                       v
+---------------------------------------------+
| 2. Check Connection State                   |
|    - If already connected (readyState === 1)|
|      return existing connection             |
+---------------------------------------------+
                       |
                       v
+---------------------------------------------+
| 3. Validate MONGO_URI                       |
|    - If missing, log error & throw Error    |
+---------------------------------------------+
                       |
                       v
+---------------------------------------------+
| 4. Attempt mongoose.connect(MONGO_URI)      |
|    - On Success: Log host & resolve         |
|    - On Failure: Log & reject error         |
+---------------------------------------------+
                       |
                       v
+---------------------------------------------+
| 5. Express Listener Launch (server/index.js)|
|    - app.listen() starts ONLY after DB      |
|      connection resolves successfully       |
+---------------------------------------------+
```

### Implementation Details ([`server/config/db.js`](file:///e:/HotelPro/server/config/db.js))

- **Duplicate Connection Prevention**: Checks `mongoose.connection.readyState === 1` before initiating a new connection.
- **Missing URI Detection**: Explicitly validates that `process.env.MONGO_URI` is present before calling `mongoose.connect()`.
- **Error Propagation**: Catches and logs connection errors, cleanly rejecting the promise to allow the application entry point to handle startup failures.
- **Listener Gating**: In [`server/index.js`](file:///e:/HotelPro/server/index.js), `app.listen()` is strictly called within `connectDB().then(...)`, ensuring the HTTP server never accepts traffic until the database is ready.

---

## 4. Schemas and Models

HotelPro models are defined in `server/models/`:

### 4.1 User Model ([`server/models/User.js`](file:///e:/HotelPro/server/models/User.js))
Manages authentication, profile details, and role authorization for guests and administrators.

| Field | Type | Attributes & Validation |
| :--- | :--- | :--- |
| `name` | String | Required, trimmed |
| `email` | String | Required, unique index, lowercase, trimmed, email regex validation |
| `passwordHash` | String | Required (salted bcrypt hash; plaintext passwords never stored) |
| `role` | String | Enum: `['guest', 'admin']`, default: `'guest'` |
| `isAdmin` | Boolean | Default: `false` (synchronized with `role` via pre-save hook) |
| `phone` | String | Optional, trimmed |
| `timestamps` | Date | `createdAt` and `updatedAt` managed by Mongoose |

- **Instance Methods**: `matchPassword(enteredPassword)` compares entered credentials against `passwordHash` using `bcrypt.compare`.
- **Pre-save Hooks**: Automatically synchronizes `role === 'admin'` with `isAdmin = true`.

### 4.2 Room Model ([`server/models/Room.js`](file:///e:/HotelPro/server/models/Room.js))
Represents hotel room inventory, capacity, photos, and current booking references.

| Field | Type | Attributes & Validation |
| :--- | :--- | :--- |
| `name` | String | Required (room name or identifier), trimmed |
| `roomNumber` | String | Room number/code (auto-synced with `name` if not specified) |
| `roomType` | String | Required (e.g. Deluxe Suite, Single Room), trimmed |
| `description` | String | Required, trimmed |
| `pricePerNight` | Number | Required, min: `0` (nightly rent/price) |
| `rentPerDay` | Number | Min: `0` (synced with `pricePerNight`) |
| `capacity` | Number | Required, min: `1` guest (room capacity/guest count) |
| `maxCount` | Number | Min: `1` (synced with `capacity`) |
| `amenities` | [String] | Array of amenities (e.g. WiFi, AC, Sea View) |
| `images` | [String] | Array of image URLs |
| `photos` | [String] | Array of photo URLs (synced with `images`) |
| `currentBookings` | [ObjectId] | Array of active reservation references (`ref: 'Booking'`) |
| `status` | String | Enum: `['available', 'maintenance']`, default: `'available'` |
| `timestamps` | Date | `createdAt` and `updatedAt` |

- **Indexes**: Compound index `{ status: 1, pricePerNight: 1 }` and `{ roomNumber: 1 }` for filtering and sorting available rooms.
- **Pre-save Hooks**: Auto-populates `roomNumber`, `rentPerDay`, `maxCount`, and `photos` from existing fields for complete backward and forward compatibility.

### 4.3 Booking Model ([`server/models/Booking.js`](file:///e:/HotelPro/server/models/Booking.js))
Manages room reservations, stay dates, guest/customer details, pricing snapshots, and lifecycle statuses.

| Field | Type | Attributes & Validation |
| :--- | :--- | :--- |
| `bookingReference` | String | Required, unique index, uppercase, trimmed (e.g., `BKG-XXXXXXXX`) |
| `user` | ObjectId | Required, reference to `User` model (`ref: 'User'`) |
| `room` | ObjectId | Required, reference to `Room` model (`ref: 'Room'`) |
| `bookingType` | String | Enum: `['standard', 'deluxe', 'suite', 'online', 'walk-in', 'direct']`, default: `'online'` |
| `guestName` / `customerName` | String | Optional guest / customer contact name |
| `email` | String | Guest contact email, lowercase, trimmed |
| `phone` | String | Guest contact phone number, trimmed |
| `checkInDate` | Date | Required |
| `checkOutDate` | Date | Required |
| `guestCount` | Number | Required, min: `1` |
| `numberOfNights` | Number | Required, min: `1` |
| `totalDays` | Number | Min: `1` (synced with `numberOfNights`) |
| `totalAmount` | Number | Required, min: `0` (calculated snapshot at booking time) |
| `amount` | Number | Min: `0` (synced with `totalAmount`) |
| `bookingStatus` | String | Enum: `['pending', 'confirmed', 'cancelled']`, default: `'pending'` |
| `status` | String | Enum: `['pending', 'confirmed', 'cancelled']`, default: `'pending'` (synced with `bookingStatus`) |
| `paymentStatus` | String | Enum: `['pending', 'paid', 'failed', 'refunded']`, default: `'pending'` |
| `payment` | ObjectId | Reference to `Payment` model (`ref: 'Payment'`) |
| `transactionId` | String | Gateway transaction ID / token reference |
| `timestamps` | Date | `createdAt` and `updatedAt` |

- **Security Compliance**: Raw credit card numbers, CVVs, or expiration dates are **strictly prohibited** from storage. Tokenized gateway transaction IDs and the `Payment` model are used instead.
- **Indexes**:
  - Compound index `{ room: 1, bookingStatus: 1, checkInDate: 1, checkOutDate: 1 }` to optimize date overlap lookups.
  - Index `{ user: 1, createdAt: -1 }` for guest booking history lookups.

### 4.4 Payment Model ([`server/models/Payment.js`](file:///e:/HotelPro/server/models/Payment.js))
Stores payment gateway transaction references and audit logs.

| Field | Type | Attributes & Validation |
| :--- | :--- | :--- |
| `bookingReference` | String | Required, uppercase, trimmed, indexed |
| `booking` | ObjectId | Optional direct reference to `Booking` model (`ref: 'Booking'`) |
| `gateway` | String | Default: `'razorpay-test'`, trimmed |
| `transactionReference` | String | Gateway transaction ID / signature, sparse index |
| `amount` | Number | Required, min: `0` |
| `currency` | String | Default: `'USD'`, uppercase, trimmed |
| `paymentStatus` | String | Enum: `['pending', 'success', 'failed']`, default: `'pending'` |
| `timestamps` | Date | `createdAt` and `updatedAt` |

- **Security Compliance**: Sensitive payment credentials (raw card numbers, expiration dates, CVVs) are **never** stored. Gateway tokenization is enforced.

---

## 5. MongoDB Atlas Setup, Configuration & Verification

### 5.1 MongoDB Atlas Cluster Setup
1. **Create an Atlas Cluster**:
   - Log into [MongoDB Cloud](https://cloud.mongodb.com/).
   - Deploy a free or dedicated cluster (e.g. `Cluster0` / AWS/GCP/Azure region).
2. **Configure Database User**:
   - Navigate to **Security** -> **Database Access**.
   - Create a database user (e.g., `hotelpro_user`) with password authentication and `readWriteAnyDatabase` or `readWrite@hotelpro` privileges.
   - *Note on Special Characters*: If the database password contains special characters (e.g. `@`, `:`, `/`, `?`, `#`), ensure they are URL-encoded (`encodeURIComponent`) or use alphanumeric characters to avoid URI parsing errors.
3. **Configure Network Access**:
   - Navigate to **Security** -> **Network Access**.
   - Add your current IP address, or allow access from anywhere (`0.0.0.0/0`) for development environments.
4. **Obtain Connection String**:
   - Navigate to **Deployment** -> **Database** -> Click **Connect**.
   - Select **Drivers** (Node.js).
   - Copy the SRV connection URI:
     ```
     mongodb+srv://<username>:<password>@<cluster-address>/hotelpro?retryWrites=true&w=majority
     ```

### 5.2 Environment Variable Configuration
Add the connection URI to your git-ignored `server/.env` file:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://hotelpro_user:<password>@cluster.anpct9g.mongodb.net/hotelpro?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173
```

### 5.3 Verifying the Atlas Connection
To test network access and authentication directly via Node:
```bash
cd server
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then((conn) => {
    console.log('MongoDB Atlas Connected successfully to:', conn.connection.host);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Connection failed:', err.message);
    process.exit(1);
  });
"
```

### 5.4 Starting the Backend Server
Launch the backend server from `server`:
```bash
cd server
npm run dev
```
Or from the project root:
```bash
npm run server
```

Expected terminal output:
```
[nodemon] starting `node index.js`
MongoDB Connected: ac-rkz8zbl-shard-00-00.anpct9g.mongodb.net
Server running in development mode on port 5000
```

---

## 6. Local MongoDB Alternative (Offline Development)

If offline or developing without an active Atlas connection:
- **Local Windows Service**: `net start MongoDB`
- **Standalone Daemon**: `mongod --dbpath "C:\data\db"`
- **Docker Container**: `docker run -d --name hotelpro-mongo -p 27017:27017 mongo:latest`
- Update `server/.env`:
  ```env
  MONGO_URI=mongodb://127.0.0.1:27017/hotelpro
  ```
