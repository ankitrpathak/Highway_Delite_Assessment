"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireEmailVerified = exports.authenticateToken = void 0;
const auth_1 = require("../utils/auth");
const User_1 = __importDefault(require("../models/User"));
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token is required'
            });
        }
        const decoded = (0, auth_1.verifyJWT)(token);
        if (!decoded) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        // Get user from database to ensure they still exist
        const user = await User_1.default.findById(decoded.userId);
        if (!user) {
            return res.status(403).json({
                success: false,
                message: 'User not found'
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication'
        });
    }
};
exports.authenticateToken = authenticateToken;
const requireEmailVerified = (req, res, next) => {
    if (!req.user?.isEmailVerified) {
        return res.status(403).json({
            success: false,
            message: 'Email verification required'
        });
    }
    next();
};
exports.requireEmailVerified = requireEmailVerified;
//# sourceMappingURL=auth.js.map