import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactNumber: { type: String, required: true },
  cnicNumber: { type: String, required: true },
  password: { type: String, required: true },
  profilePhoto: { type: String, default: '' },
  cnicFront: { type: String, default: '' },
  cnicBack: { type: String, default: '' },
  criminalClearance: { type: String, default: '' },
  skills: { type: Object, default: {} },
  certifications: { type: Array, default: [] },
  location: { type: String, default: '' },
  isComplete: { type: Boolean, default: false },
  // OTP Fields
  otp: { type: String, default: undefined },
  otpExpiry: { type: Date, default: undefined },
  otpVerified: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Provider', providerSchema);
