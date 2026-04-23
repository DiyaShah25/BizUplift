/**
 * src/config/db.js — MongoDB Atlas connection via Mongoose
 */

const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        // Mongoose 8.x uses these by default; kept for clarity
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    return conn;
};

module.exports = connectDB;
