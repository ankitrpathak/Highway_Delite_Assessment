"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.resendOTP = exports.login = exports.verifyOTP = exports.signup = void 0;
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../utils/auth");
const emailService_1 = __importDefault(require("../utils/emailService"));
const signup = async (req, res) => {
    try {
        const { name, email, dateOfBirth, password } = req.body;
        // Validate required fields
        if (!name || !email || !dateOfBirth || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: name, email, dateOfBirth, password'
            });
        }
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        // Validate date of birth
        const dob = new Date(dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 13) {
            return res.status(400).json({
                success: false,
                message: 'You must be at least 13 years old to register'
            });
        }
        // Generate OTP
        const otp = (0, auth_1.generateOTP)();
        const otpExpiry = (0, auth_1.getOTPExpiry)();
        // Create user but don't verify email yet
        const user = new User_1.default({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            dateOfBirth: dob,
            password,
            otpCode: otp,
            otpExpiry,
            isEmailVerified: false
        });
        await user.save();
        // Send OTP email
        const emailSent = await emailService_1.default.sendOTP(email, otp, name);
        if (!emailSent) {
            // If email fails, we still created the user but warn about OTP
            return res.status(201).json({
                success: true,
                message: 'User created but failed to send OTP email. Please try requesting OTP again.',
                data: {
                    userId: user._id,
                    email: user.email,
                    requiresOTP: true
                }
            });
        }
        res.status(201).json({
            success: true,
            message: 'User created successfully. Please check your email for OTP verification.',
            data: {
                userId: user._id,
                email: user.email,
                requiresOTP: true
            }
        });
    }
    catch (error) {
        console.error('Signup error:', error);
        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                error: validationErrors.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            message: 'Internal server error during signup'
        });
    }
};
exports.signup = signup;
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }
        // Find user with matching email and OTP
        const user = await User_1.default.findOne({
            email: email.toLowerCase(),
            otpCode: otp,
            otpExpiry: { $gt: new Date() }
        }).select('+otpCode +otpExpiry');
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }
        // Mark email as verified and clear OTP
        user.isEmailVerified = true;
        user.otpCode = undefined;
        user.otpExpiry = undefined;
        await user.save();
        // Generate JWT token
        const token = (0, auth_1.generateJWT)(user._id.toString());
        // Return user data without sensitive fields
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            isVerified: user.isEmailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            data: {
                token,
                user: userData
            }
        });
    }
    catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during OTP verification'
        });
    }
};
exports.verifyOTP = verifyOTP;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        // Find user and include password for comparison
        const user = await User_1.default.findOne({
            email: email.toLowerCase()
        }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        // Check if user has a password (not a Google OAuth user)
        if (!user.password) {
            return res.status(400).json({
                success: false,
                message: 'This account was created with Google. Please use Google sign-in.'
            });
        }
        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(403).json({
                success: false,
                message: 'Please verify your email before logging in',
                data: {
                    requiresOTP: true,
                    email: user.email
                }
            });
        }
        // Generate JWT token
        const token = (0, auth_1.generateJWT)(user._id.toString());
        // Return user data without sensitive fields
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            isVerified: user.isEmailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: userData
            }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during login'
        });
    }
};
exports.login = login;
const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        const user = await User_1.default.findOne({
            email: email.toLowerCase(),
            isEmailVerified: false
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found or already verified'
            });
        }
        // Generate new OTP
        const otp = (0, auth_1.generateOTP)();
        const otpExpiry = (0, auth_1.getOTPExpiry)();
        user.otpCode = otp;
        user.otpExpiry = otpExpiry;
        await user.save();
        // Send OTP email
        const emailSent = await emailService_1.default.sendOTP(email, otp, user.name);
        if (!emailSent) {
            return res.status(500).json({
                success: false,
                message: 'Failed to send OTP email. Please try again.'
            });
        }
        res.status(200).json({
            success: true,
            message: 'OTP sent successfully to your email'
        });
    }
    catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while resending OTP'
        });
    }
};
exports.resendOTP = resendOTP;
const getUserProfile = async (req, res) => {
    try {
        const authReq = req;
        const user = authReq.user;
        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            dateOfBirth: user.dateOfBirth,
            isVerified: user.isEmailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        res.status(200).json({
            success: true,
            message: 'User profile retrieved successfully',
            data: { user: userData }
        });
    }
    catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while fetching profile'
        });
    }
};
exports.getUserProfile = getUserProfile;
//# sourceMappingURL=authController.js.map