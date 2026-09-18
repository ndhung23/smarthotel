const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smarthotel';
    const isLocal = mongoURI.includes('127.0.0.1') || mongoURI.includes('localhost');

    if (process.env.NODE_ENV === 'production' && isLocal) {
      console.warn(
        '\x1b[33m%s\x1b[0m',
        '[WARNING] Server đang chạy ở Production Mode nhưng MONGO_URI vẫn dùng Localhost (127.0.0.1). Hãy cấu hình MONGO_URI trỏ tới MongoDB Atlas trong môi trường production.'
      );
    }

    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

module.exports = connectDB;