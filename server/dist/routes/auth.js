"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const rateLimiter_1 = require("../middleware/rateLimiter");
const router = express_1.default.Router();
// Public routes with rate limiting
router.post('/signup', rateLimiter_1.signupLimiter, validation_1.validateSignup, authController_1.signup);
router.post('/login', rateLimiter_1.authLimiter, validation_1.validateLogin, authController_1.login);
router.post('/verify-otp', rateLimiter_1.otpLimiter, validation_1.validateOTP, authController_1.verifyOTP);
router.post('/resend-otp', rateLimiter_1.otpLimiter, validation_1.validateEmail, authController_1.resendOTP);
// Protected routes
router.get('/profile', auth_1.authenticateToken, authController_1.getUserProfile);
// Test route to verify JWT is working
router.get('/protected', auth_1.authenticateToken, auth_1.requireEmailVerified, (req, res) => {
    res.json({
        success: true,
        message: 'Access granted to protected route',
        data: {
            userId: req.user._id,
            timestamp: new Date().toISOString()
        }
    });
});
exports.default = router;
//# sourceMappingURL=auth.js.map