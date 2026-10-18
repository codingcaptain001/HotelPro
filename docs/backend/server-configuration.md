# Server Configuration

## 1. Overview

The backend server is built with Express 5 and Node.js. It separates application configuration (`server/app.js`) from database connection and HTTP listener bootstrap (`server/index.js`).

---

## 2. Server Entry Point: `server/index.js`

```javascript
const path = require('path');
// Explicit path resolution prevents dotenv from failing when launched from root
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('CRITICAL: MONGO_URI environment variable is missing.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`HotelPro API Server active on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB Atlas:', err.message);
    process.exit(1);
  });
```

---

## 3. Application Pipeline: `server/app.js`

```javascript
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const app = express();

// 1. CORS Configuration with Credentials Support
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// 2. Request Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. API Route Mounting
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// 4. Fallback Error Handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;
```

---

## 4. Key Configuration Parameters

| Parameter | Source | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | `process.env.PORT` | `5000` | HTTP listener port |
| `MONGO_URI` | `process.env.MONGO_URI` | *None (Required)* | MongoDB Atlas connection string with TLS & credentials |
| `JWT_SECRET` | `process.env.JWT_SECRET` | *None (Required)* | Cryptographic HMAC secret for signing tokens |
| `CLIENT_URL` | `process.env.CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin for cross-origin credentials |
| `NODE_ENV` | `process.env.NODE_ENV` | `development` | Environment mode (`development` vs `production`) |
