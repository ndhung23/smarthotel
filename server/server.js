require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// Enable trust proxy for cloud deployment (Render, Railway, Heroku, Nginx)
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// CORS Configuration - Support multi-origin whitelist & same-origin
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, postman, mobile, same-origin SPA)
      if (!origin || allowedOrigins.includes(origin) || !isProduction) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// Logging
if (isProduction) {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api', limiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting',
  };

  const isCloudDB = (process.env.MONGO_URI || '').includes('mongodb+srv://');

  res.status(200).json({
    success: true,
    message: 'SmartHotel API Server is running smoothly',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
    database: {
      status: dbStatusMap[dbState] || 'Unknown',
      connected: dbState === 1,
      type: isCloudDB ? 'MongoDB Atlas (Cloud)' : 'MongoDB Local',
    },
    environment: process.env.NODE_ENV || 'development',
  });
});

// Production: Serve React frontend build (SPA monolithic deployment)
if (isProduction) {
  const clientBuildPath = path.join(__dirname, '../client/build');
  app.use(express.static(clientBuildPath));

  // Catch-all middleware for SPA client-side routing (Express 5 compatible)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.originalUrl.startsWith('/api')) {
      return res.sendFile(path.join(clientBuildPath, 'index.html'));
    }
    next();
  });
} else {
  // Root welcome route for development
  app.get('/', (req, res) => {
    res.json({
      name: 'SmartHotel API',
      version: '1.0.0',
      description: 'SmartHotel Management Backend Service',
      healthCheck: '/api/health',
      clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
    });
  });
}

// 404 & Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`[SmartHotel Server] Listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
