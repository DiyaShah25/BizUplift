/**
 * server.js — Entry point for BizUplift backend
 * Loads env, connects DB, then starts Express.
 */

const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./src/config/db');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas, then start server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`\n🚀 BizUplift API running on http://localhost:${PORT}`);
        console.log(`📦 Environment: ${process.env.NODE_ENV}`);
        console.log(`🔗 MongoDB Atlas connected\n`);
    });
}).catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
});
