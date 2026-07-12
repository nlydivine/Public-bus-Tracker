const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env and configure it.');
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB disconnected — will retry on next request');
  });

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
  });

  console.log(`[db] Connected to MongoDB: ${mongoose.connection.name}`);
}

module.exports = connectDB;
