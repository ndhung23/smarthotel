require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const connectDB = require('./config/db');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Global Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
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

  res.status(200).json({
    success: true,
    message: 'SmartHotel API Server is running smoothly',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
    database: {
      status: dbStatusMap[dbState] || 'Unknown',
      connected: dbState === 1,
    },
    environment: process.env.NODE_ENV || 'development',
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    name: 'SmartHotel API',
    version: '1.0.0',
    description: 'SmartHotel Management Backend Service',
    healthCheck: '/api/health',
  });
});

// 404 & Error Handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`[SmartHotel Server] Listening on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

