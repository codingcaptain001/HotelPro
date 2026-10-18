# Middleware & Authorization

## 1. Overview

HotelPro secures endpoints using layered Express middleware located in `server/middleware/`.

---

## 2. Authentication Middleware: `protect` (`server/middleware/authMiddleware.js`)

The `protect` middleware ensures that only requests accompanied by a valid, unexpired JSON Web Token can proceed.

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // 1. Check HTTP-only cookie first
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } 
  // 2. Fall back to Authorization: Bearer <token>
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-passwordHash');
    if (!req.user) {
      return res.status(401).json({ message: 'User belonging to this token no longer exists' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};
```

---

## 3. Role-Based Authorization Guard: `adminOnly`

The `adminOnly` middleware operates immediately downstream of `protect`:

```javascript
const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.isAdmin === true)) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Administrative privileges required' });
  }
};

module.exports = { protect, adminOnly };
```

---

## 4. Error Handling Middlewares (`server/middleware/errorMiddleware.js`)

### Route Not Found (`notFound`)
Catches any unhandled URL routes and forwards a formatted 404 error:
```javascript
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};
```

### Global Error Handler (`errorHandler`)
Normalizes all unhandled exceptions into uniform JSON responses:
```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
```
