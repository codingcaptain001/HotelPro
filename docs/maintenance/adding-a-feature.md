# Guide: Adding a Full-Stack Feature

## 1. Overview

Follow this standardized 5-step checklist when introducing new functionality to HotelPro (e.g. adding a *Room Review / Rating* feature).

---

## 2. Step-by-Step Implementation Checklist

### Step 1: Model Schema Definition (`server/models/`)
Create or extend the Mongoose model in `server/models/Review.js`:
```javascript
const mongoose = require('mongoose');
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true }
}, { timestamps: true });
module.exports = mongoose.model('Review', reviewSchema);
```

### Step 2: Controller Business Logic (`server/controllers/`)
Implement request handlers in `server/controllers/reviewController.js`:
```javascript
const Review = require('../models/Review');
exports.createReview = async (req, res) => {
  const review = await Review.create({ ...req.body, user: req.user._id });
  res.status(201).json(review);
};
```

### Step 3: Route Declaration (`server/routes/`)
Define route endpoints and apply `protect` / `adminOnly` guards in `server/routes/reviewRoutes.js`:
```javascript
const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { createReview } = require('../controllers/reviewController');

router.post('/', protect, createReview);
module.exports = router;
```
Mount in `server/app.js`: `app.use('/api/reviews', reviewRoutes);`.

### Step 4: Frontend API Consumption (`client/src/`)
Invoke the endpoint using `api.js`:
```javascript
import api from '../services/api';
await api.post('/reviews', { room: roomId, rating, comment });
```

### Step 5: Verification & Build Check
```bash
cd client && npm run build
```
Verify that the build passes and stage your changes.
