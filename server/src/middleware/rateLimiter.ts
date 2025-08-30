import rateLimit from 'express-rate-limit';

// General auth rate limiter - 10 requests per minute
export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in a minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for OTP endpoints - 5 requests per 5 minutes
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Limit each IP to 5 OTP requests per windowMs
  message: {
    success: false,
    message: 'Too many OTP requests. Please wait 5 minutes before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict rate limiter for signup - 3 signups per hour
export const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 signup requests per hour
  message: {
    success: false,
    message: 'Too many signup attempts. Please try again in an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
