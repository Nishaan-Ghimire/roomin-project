// models/otp.model.js
import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: String,
  code: String,
  expiresAt: Date,
});

const Otp = mongoose.model('Otp', otpSchema);

export default Otp;
