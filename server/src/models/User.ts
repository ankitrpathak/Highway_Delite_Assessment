import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  dateOfBirth: Date;
  password?: string;
  googleId?: string;
  isEmailVerified: boolean;
  otpCode?: string;
  otpExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Date of birth is required'],
      validate: {
        validator: function(value: Date) {
          const today = new Date();
          const age = today.getFullYear() - value.getFullYear();
          return age >= 13; // Minimum age requirement
        },
        message: 'You must be at least 13 years old to register'
      }
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Don't include password in queries by default
    },
    googleId: {
      type: String,
      sparse: true // Allow null values but ensure uniqueness when present
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    otpCode: {
      type: String,
      select: false
    },
    otpExpiry: {
      type: Date,
      select: false
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

const User = mongoose.model<IUser>('User', userSchema);

export default User;
