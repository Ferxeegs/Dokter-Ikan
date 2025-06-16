import User from '../models/UserModel.js';
import FishExperts from '../models/FishExpertsModel.js';
import OtpVerification from '../models/OtpVerificationModel.js';
import { Op } from 'sequelize';
import moment from 'moment';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import PasswordReset from '../models/PasswordResetModel.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import "regenerator-runtime/runtime.js";

dotenv.config();

export const startRegistration = async (req, res) => {
  const { email } = req.body;

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.fail('Email sudah terdaftar.');
    }

    // Generate OTP dan waktu kadaluarsa
    const otp_code = Math.floor(100000 + Math.random() * 900000).toString();
    const otp_expiry = moment().add(15, 'minutes').toDate();

    // Simpan OTP ke database
    await OtpVerification.create({
      email,
      otp_code,
      otp_expiry,
      is_verified: false
    });

    // Konfigurasi Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Dokter Ikan" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'OTP untuk Registrasi Akun di Aplikasi Dokter Ikan',
      text: `Halo,

Terima kasih telah mendaftar di Aplikasi Dokter Ikan! Untuk melanjutkan proses registrasi, kami telah mengirimkan kode OTP (One-Time Password) untuk verifikasi email Anda.

Kode OTP Anda adalah: ${otp_code}

Pastikan kode ini tidak dibagikan dengan siapa pun. Kode OTP ini berlaku selama 15 menit. Setelah berhasil memverifikasi OTP, Anda dapat melanjutkan ke langkah berikutnya dalam registrasi.

Jika Anda tidak melakukan registrasi ini, silakan abaikan email ini.

Salam hangat,
Tim Dokter Ikan`
    };

    // Kirim email
    await transporter.sendMail(mailOptions);

    return res.success('OTP telah dikirim ke email Anda.');

  } catch (error) {
    console.error('Error during registration:', error);
    return res.fail('Terjadi kesalahan, coba lagi nanti.', error.message, 500);
  }
};

// Fungsi untuk verifikasi OTP
export const verifyOtp = async (req, res) => {
  const { email, otp_code } = req.body;

  try {
    const otpRecord = await OtpVerification.findOne({
      where: {
        email,
        otp_code,
        otp_expiry: { [Op.gte]: moment().toDate() },
        is_verified: false
      }
    });

    if (!otpRecord) {
      return res.fail('Kode OTP tidak valid atau telah kadaluarsa');
    }

    otpRecord.is_verified = true;
    await otpRecord.save();

    return res.success('OTP berhasil diverifikasi, lanjutkan ke pengisian data');
  } catch (error) {
    console.error(error);
    return res.fail('Terjadi kesalahan, coba lagi nanti.', error.message, 500);
  }
};

export const completeRegistration = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const otpRecord = await OtpVerification.findOne({
      where: {
        email,
        is_verified: true
      }
    });

    if (!otpRecord) {
      return res.fail('OTP belum diverifikasi atau kadaluarsa');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      name,
      password: hashedPassword
    });

    await otpRecord.destroy();

    return res.success('Registrasi berhasil. Akun Anda telah aktif', {
      id: newUser.user_id,
      email: newUser.email,
      name: newUser.name
    });
  } catch (error) {
    console.error(error);
    return res.fail('Terjadi kesalahan, coba lagi nanti.', error.message, 500);
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Check in both User and FishExperts tables
    const user = await User.findOne({ where: { email } });
    const expert = await FishExperts.findOne({ where: { email } });

    // If email not found in either table
    if (!user && !expert) {
      return res.fail('Email tidak terdaftar', null, 404);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = moment().add(10, 'minutes').toDate();
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Create password reset record based on user type
    if (user) {
      await PasswordReset.create({
        user_id: user.user_id,
        fishExpert_id: null,
        reset_token: hashedToken,
        reset_token_expiry: tokenExpiry,
        user_type: 'user'
      });
    } else {
      await PasswordReset.create({
        user_id: null,
        fishExpert_id: expert.fishExperts_id,
        reset_token: hashedToken,
        reset_token_expiry: tokenExpiry,
        user_type: 'expert'
      });
    }

    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword?token=${resetToken}&email=${email}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Dokter Ikan" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Reset Password Link',
      text: `Halo ${user ? user.name : expert.name},

Link untuk reset password Anda: ${resetUrl}

Link ini akan kadaluarsa dalam 10 menit.

Jika Anda tidak meminta reset password, abaikan email ini.

Salam,
Tim Dokter Ikan`
    };

    await transporter.sendMail(mailOptions);

    return res.success('Link reset password telah dikirim ke email Anda');
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return res.fail('Terjadi kesalahan saat mengirim link reset password', error.message, 500);
  }
};

export const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!token) {
    return res.fail('Token tidak valid atau tidak ada');
  }

  try {
    // Check both tables
    const user = await User.findOne({ where: { email } });
    const expert = await FishExperts.findOne({ where: { email } });

    if (!user && !expert) {
      return res.fail('Email tidak terdaftar', null, 404);
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Construct where clause based on user type
    const whereClause = {
      reset_token: hashedToken,
      reset_token_expiry: { [Op.gt]: new Date() }
    };

    // Add the correct ID field based on user type
    if (user) {
      whereClause.user_id = user.user_id;
      whereClause.user_type = 'user';
    } else {
      whereClause.fishExpert_id = expert.fishExperts_id;
      whereClause.user_type = 'expert';
    }

    // Find the password reset record
    const passwordReset = await PasswordReset.findOne({
      where: whereClause
    });

    if (!passwordReset) {
      return res.fail('Token tidak valid atau sudah kadaluarsa');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password based on user type
    if (passwordReset.user_type === 'user' && user) {
      await User.update(
        { password: hashedPassword },
        { where: { user_id: user.user_id } }
      );
    } else if (passwordReset.user_type === 'expert' && expert) {
      await FishExperts.update(
        { password: hashedPassword },
        { where: { fishExperts_id: expert.fishExperts_id } }
      );
    }

    // Delete all reset tokens for this user/expert
    await PasswordReset.destroy({
      where: user ? { user_id: user.user_id } : { fishExpert_id: expert.fishExperts_id }
    });

    return res.success('Password berhasil direset');
  } catch (error) {
    console.error('Error in resetPassword:', error);
    return res.fail('Terjadi kesalahan saat mereset password', error.message, 500);
  }
};

export const verifyTokenFromCookie = (req, res) => {
  console.log('=== VERIFY TOKEN DEBUG ===');
  console.log('All cookies:', req.cookies);
  console.log('Cookie header:', req.headers.cookie);
  console.log('Origin:', req.headers.origin);
  console.log('User-Agent:', req.headers['user-agent']);
  
  const token = req.cookies.token;

  if (!token) {
    console.log('❌ Token tidak ditemukan di cookies');
    console.log('Available cookies:', Object.keys(req.cookies || {}));
    
    // Coba parse manual dari cookie header
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
      console.log('Manual cookie parsing dari header...');
      const tokenMatch = cookieHeader.match(/token=([^;]+)/);
      if (tokenMatch) {
        console.log('Token found via manual parsing!');
        const manualToken = tokenMatch[1];
        try {
          const decoded = jwt.verify(manualToken, process.env.JWT_SECRET);
          return res.status(200).json({ 
            success: true, 
            message: 'Token valid (manual parse)', 
            user: decoded 
          });
        } catch (error) {
          console.log('Manual token invalid:', error.message);
        }
      }
    }
    
    return res.status(401).json({ 
      success: false, 
      message: 'Token tidak ditemukan di cookies',
      debug: {
        cookiesReceived: Object.keys(req.cookies || {}),
        cookieHeader: req.headers.cookie || 'No cookie header'
      }
    });
  }

  try {
    console.log('✅ Token found, verifying...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token valid:', { id: decoded.id, role: decoded.role });
    
    return res.status(200).json({ 
      success: true, 
      message: 'Token valid', 
      user: decoded 
    });
  } catch (error) {
    console.log('❌ Token verification failed:', error.message);
    return res.status(403).json({ 
      success: false, 
      message: 'Token tidak valid', 
      error: error.message 
    });
  }
};
