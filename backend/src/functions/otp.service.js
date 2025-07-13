// services/otp.service.js
import nodemailer from 'nodemailer';

export const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nitigyajoshi@gmail.com',
    pass: 'oswb onyn gheg tnvu',
  },
});

export const sendOtpEmail = async (toEmail, otp) => {
  await transporter.sendMail({
    from: `"RoomIn" <nitigyajoshi@gmail.com>`,
    to: toEmail,
    subject: 'Your OTP Code',
    html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
  });
};
