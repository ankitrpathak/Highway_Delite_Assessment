# Notes App API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### 1. User Signup
**POST** `/auth/signup`

Register a new user and send OTP for email verification.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "dateOfBirth": "1990-01-15",
  "password": "securePassword123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully. Please check your email for OTP verification.",
  "data": {
    "userId": "user_id_here",
    "email": "john@example.com",
    "requiresOTP": true
  }
}
```

**Rate Limit:** 3 requests per hour per IP

---

### 2. Verify OTP
**POST** `/auth/verify-otp`

Verify email address using OTP and get authentication token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "dateOfBirth": "1990-01-15T00:00:00.000Z",
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Rate Limit:** 5 requests per 5 minutes per IP

---

### 3. User Login
**POST** `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "dateOfBirth": "1990-01-15T00:00:00.000Z",
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Rate Limit:** 10 requests per minute per IP

---

### 4. Resend OTP
**POST** `/auth/resend-otp`

Resend OTP for email verification.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully to your email"
}
```

**Rate Limit:** 5 requests per 5 minutes per IP

---

### 5. Get User Profile
**GET** `/auth/profile`

Get current user's profile information. Requires authentication.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "dateOfBirth": "1990-01-15T00:00:00.000Z",
      "isVerified": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 6. Protected Test Route
**GET** `/auth/protected`

Test endpoint to verify JWT authentication. Requires verified email.

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Access granted to protected route",
  "data": {
    "userId": "user_id",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name must be at least 2 characters long",
    "Password must contain at least one letter"
  ]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Access Denied (403)
```json
{
  "success": false,
  "message": "Email verification required"
}
```

### Rate Limit Error (429)
```json
{
  "success": false,
  "message": "Too many authentication attempts. Please try again in a minute."
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error during signup"
}
```

---

## Setup Instructions

1. Create a `.env` file in the server directory based on `.env.example`
2. Configure MongoDB connection string
3. Set up email credentials for OTP sending (Gmail app password recommended)
4. Set a secure JWT secret
5. Run `npm install` to install dependencies
6. Run `npm run dev` for development or `npm run build && npm start` for production

## Environment Variables Required

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `JWT_EXPIRES_IN`: JWT token expiration time (default: "7d")
- `EMAIL_SERVICE`: Email service provider (default: "gmail")
- `EMAIL_USER`: Email address for sending OTPs
- `EMAIL_PASS`: Email password or app password
- `PORT`: Server port (default: 5000)
