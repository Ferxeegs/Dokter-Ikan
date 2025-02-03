import { Op } from 'sequelize';
import crypto from 'crypto';
import User from '../models/User.js';
import nodemailer from 'nodemailer';
import moment from 'moment';

// Fungsi untuk mengirim OTP ke email
export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Periksa apakah user dengan email ini sudah terdaftar
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Generate OTP (misalnya, 6 digit angka)
    const otp = crypto.randomInt(100000, 999999).toString();

    // Tentukan waktu kedaluwarsa OTP (misalnya, 5 menit)
    const otpExpiry = moment().add(5, 'minutes').toDate();

    // Update OTP dan otp_expiry pada user
    await user.update({
      otp_code: otp,
      otp_expiry: otpExpiry
    });

    // Kirim OTP melalui email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',  // Ganti dengan email pengirim
        pass: 'your-email-password'    // Ganti dengan password email pengirim
      }
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'OTP telah dikirim ke email Anda' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mengirim OTP' });
  }
};

// Fungsi untuk memverifikasi OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Periksa apakah OTP yang dimasukkan sesuai dan belum kedaluwarsa
    if (user.otp_code !== otp) {
      return res.status(400).json({ message: 'OTP tidak valid' });
    }

    if (moment().isAfter(user.otp_expiry)) {
      return res.status(400).json({ message: 'OTP sudah kedaluwarsa' });
    }

    // OTP valid, reset otp_code dan otp_expiry
    await user.update({
      otp_code: null,
      otp_expiry: null
    });

    return res.status(200).json({ message: 'OTP berhasil diverifikasi' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat memverifikasi OTP' });
  }
};
