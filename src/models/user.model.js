import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  label: { type: String },
  street: { type: String },
  city: { type: String },
  state: { type: String },
  postalCode: { type: String },
  country: { type: String }
}, { _id: false });

const sessionSchema = new mongoose.Schema({
  device: { type: String },
  ip: { type: String },
  userAgent: { type: String },
  refreshToken: { type: String },
  createdAt: { type: Date, default: Date.now },
  lastSeenAt: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
  firstName: { type: String, trim: true, required: true },
  lastName: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['customer', 'farmer', 'admin'], default: 'customer' },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, select: false },
  verificationExpires: { type: Date },
  otpCode: { type: String, select: false },
  otpExpires: { type: Date, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  addresses: [addressSchema],
  preferences: {
    notifications: { type: Boolean, default: true },
    newsletter: { type: Boolean, default: false }
  },
  walletBalance: { type: Number, default: 0 },
  sessions: [sessionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userSchema.index({ role: 1 });

const User = mongoose.model('User', userSchema);
export default User;
