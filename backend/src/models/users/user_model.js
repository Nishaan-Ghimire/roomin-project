import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    profilePhoto: { type: String }, // can be URL or Cloudinary ID
    role: {
      type: String,
      enum: ['user', 'vendor','admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
