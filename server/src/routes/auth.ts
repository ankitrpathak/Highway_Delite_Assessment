import express from 'express';
import { signup, login, verifyOTP, resendOTP, getUserProfile } from '../controllers/authController';
import { authenticateToken, requireEmailVerified } from '../middleware/auth';
import { validateSignup, validateLogin, validateOTP, validateEmail } from '../middleware/validation';
import { authLimiter, otpLimiter, signupLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Public routes with rate limiting
router.post('/signup', signupLimiter, validateSignup, signup);
router.post('/login', authLimiter, validateLogin, login);
router.post('/verify-otp', otpLimiter, validateOTP, verifyOTP);
router.post('/resend-otp', otpLimiter, validateEmail, resendOTP);

// Protected routes
router.get('/profile', authenticateToken, getUserProfile);

// Test route to verify JWT is working
router.get('/protected', authenticateToken, requireEmailVerified, (req, res) => {
  res.json({
    success: true,
    message: 'Access granted to protected route',
    data: {
      userId: (req as any).user._id,
      timestamp: new Date().toISOString()
    }
  });
});

export default router;
