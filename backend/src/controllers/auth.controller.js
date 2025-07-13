// controllers/auth.controller.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {User} from '../models/users/user_model.js';
import Otp from '../models/users/otp.model.js';
import { generateOTP, sendOtpEmail } from '../functions/otp.service.js';

const secretjwtforresetpass = 'a-string-secret-at-least-256-bits-long';

export const createAccountOtp = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.deleteMany({ email });
  await Otp.create({ email, code: otp, expiresAt });
  await sendOtpEmail(email, otp);

  res.json({ message: 'OTP sent' });
};

export const forgotPasswordOtp = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Email not registered' });

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await Otp.deleteMany({ email });
  await Otp.create({ email, code: otp, expiresAt });
  await sendOtpEmail(email, otp);

  res.json({ message: 'OTP sent' });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = await Otp.findOne({ email });

  if (!record) return res.status(400).json({ message: 'No OTP found' });
  if (record.expiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' });
  if (record.code !== otp) return res.status(400).json({ message: 'Invalid OTP' });

  await Otp.deleteMany({ email });

  const resetToken = jwt.sign({ email }, secretjwtforresetpass, { expiresIn: '10m' });
  res.json({ message: 'OTP verified', resetToken });
};

export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) {
    return res.status(400).json({ message: 'Token and new password required' });
  }

  try {
    const { email } = jwt.verify(resetToken, secretjwtforresetpass);
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};
