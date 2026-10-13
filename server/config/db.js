const mongoose = require('mongoose');

const connectDB = async () => {
  // Avoid duplicate connection attempts if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // Ensure environment variables are loaded
  if (!process.env.MONGO_URI) {
    require('dotenv').config();
  }

  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    const errorMsg = 'MONGO_URI is not defined in environment variables. Please check your .env configuration.';
    console.error(`Database Configuration Error: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    const sanitizedError = (error.message || '').replace(/(mongodb(?:\+srv)?:\/\/)([^:@\s]+):([^@\s]+)@/gi, '$1***:***@');
    console.error(`Database Connection Failed: ${sanitizedError}`);
    throw new Error(sanitizedError);
  }
};

module.exports = connectDB;
