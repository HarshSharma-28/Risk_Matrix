const rateLimit = require('express-rate-limit');

// 100 requests per 15 minutes per IP
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,                  
  message: {
    success: false,
    error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Try again in 15 minutes.' }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for auth endpoints (e.g. login, signup)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    error: { code: 'AUTH_RATE_LIMIT', message: 'Too many login attempts. Account temporarily locked.' }
  }
});

module.exports = { rateLimiter, authLimiter };
