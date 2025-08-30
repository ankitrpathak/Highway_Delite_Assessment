// User related types
export interface User {
  _id: string;
  email: string;
  name: string;
  dateOfBirth: Date;
  isVerified: boolean;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSignupData {
  name: string;
  email: string;
  dateOfBirth: Date;
  password: string;
}

export interface UserLoginData {
  email: string;
  password?: string;
  otp?: string;
}

// Note related types
export interface Note {
  _id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteData {
  title: string;
  content: string;
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// OTP related types
export interface OTPVerification {
  email: string;
  otp: string;
}
