const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errorHandler, notFound } = require('./src/middleware/errorMiddleware');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/rooms', require('./src/routes/roomRoutes'));
app.use('/api/bookings', require('./src/routes/bookingRoutes'));

app.get('/', (req, res) => {
  res.send('HotelPro API is running');
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
