import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../utils/auth';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const decoded = verifyJWT(token);
    
    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Get user from database to ensure they still exist
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
};

export const requireEmailVerified = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required'
    });
  }
  next();
};
