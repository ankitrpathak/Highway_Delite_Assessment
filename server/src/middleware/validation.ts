import { Request, Response, NextFunction } from 'express';

export const validateSignup = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, dateOfBirth, password } = req.body;
  const errors: string[] = [];

  // Name validation
  if (!name || typeof name !== 'string') {
    errors.push('Name is required and must be a string');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  } else if (name.trim().length > 50) {
    errors.push('Name cannot exceed 50 characters');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string') {
    errors.push('Email is required and must be a string');
  } else if (!emailRegex.test(email)) {
    errors.push('Please provide a valid email address');
  }

  // Date of birth validation
  if (!dateOfBirth) {
    errors.push('Date of birth is required');
  } else {
    const dob = new Date(dateOfBirth);
    if (isNaN(dob.getTime())) {
      errors.push('Please provide a valid date of birth');
    } else {
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        // Adjust age if birthday hasn't occurred this year
      }
      
      if (age < 13) {
        errors.push('You must be at least 13 years old to register');
      } else if (age > 120) {
        errors.push('Please provide a valid date of birth');
      }
    }
  }

  // Password validation
  if (!password || typeof password !== 'string') {
    errors.push('Password is required and must be a string');
  } else {
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (password.length > 128) {
      errors.push('Password cannot exceed 128 characters');
    }
    if (!/(?=.*[a-zA-Z])/.test(password)) {
      errors.push('Password must contain at least one letter');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const errors: string[] = [];

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string') {
    errors.push('Email is required and must be a string');
  } else if (!emailRegex.test(email)) {
    errors.push('Please provide a valid email address');
  }

  // Password validation
  if (!password || typeof password !== 'string') {
    errors.push('Password is required and must be a string');
  } else if (password.length < 1) {
    errors.push('Password cannot be empty');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

export const validateOTP = (req: Request, res: Response, next: NextFunction) => {
  const { email, otp } = req.body;
  const errors: string[] = [];

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string') {
    errors.push('Email is required and must be a string');
  } else if (!emailRegex.test(email)) {
    errors.push('Please provide a valid email address');
  }

  // OTP validation
  if (!otp || typeof otp !== 'string') {
    errors.push('OTP is required and must be a string');
  } else if (!/^\d{6}$/.test(otp)) {
    errors.push('OTP must be a 6-digit number');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

export const validateEmail = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const errors: string[] = [];

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string') {
    errors.push('Email is required and must be a string');
  } else if (!emailRegex.test(email)) {
    errors.push('Please provide a valid email address');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};
