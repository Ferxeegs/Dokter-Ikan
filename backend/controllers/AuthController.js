import User from '../models/UserModel.js';
import OtpVerification from '../models/OtpVerificationModel.js';
import { Op } from 'sequelize';
import moment from 'moment';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import PasswordReset from '../models/PasswordResetModel.js';
import crypto from 'crypto';
import "regenerator-runtime/runtime";


dotenv.config();

export const startRegistration = async (req, res) => {
    const { email } = req.body;
  
    try {
      // Cek apakah email sudah terdaftar
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email sudah terdaftar' });
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
  
      return res.status(200).json({ message: 'OTP telah dikirim ke email Anda.' });
  
    } catch (error) {
      console.error('Error sending email:', error);
  
      // Tangani error dengan baik
      return res.status(500).json({ message: 'Terjadi kesalahan, coba lagi nanti.' });
    }
  };

// Fungsi untuk verifikasi OTP
export const verifyOtp = async (req, res) => {
  const { email, otp_code } = req.body;

  console.log('Received email:', email);
  console.log('Received otp_code:', otp_code);

  try {
    // Cari OTP yang sesuai dengan email dan kode OTP
    const otpRecord = await OtpVerification.findOne({
        where: {
          email,
          otp_code,
          otp_expiry: { [Op.gte]: moment().toDate() }, // Pastikan `moment().toDate()` mengembalikan tipe data yang benar
          is_verified: false
        }
      });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Kode OTP tidak valid atau telah kadaluarsa' });
    }

    // Tandai OTP sebagai terverifikasi
    otpRecord.is_verified = true;
    await otpRecord.save();

    return res.status(200).json({ message: 'OTP berhasil diverifikasi, lanjutkan ke pengisian data' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan, coba lagi nanti' });
  }
};

// Fungsi untuk melengkapi pendaftaran setelah OTP diverifikasi
export const completeRegistration = async (req, res) => {
  const { email, name, password, address } = req.body;

  try {
    // Cari OTP yang sudah terverifikasi
    const otpRecord = await OtpVerification.findOne({
      where: {
        email,
        is_verified: true
      }
    });

    if (!otpRecord) {
      return res.status(400).json({ message: 'OTP belum diverifikasi atau kadaluarsa' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    // Buat pengguna baru setelah OTP diverifikasi
    const newUser = await User.create({
      email,
      name,
      password : hashedPassword,
      address
    });

    // Hapus data OTP setelah selesai digunakan
    await otpRecord.destroy();

    return res.status(201).json({
      message: 'Registrasi berhasil. Akun Anda telah aktif',
      user: newUser
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan, coba lagi nanti' });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Generate token unik
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = moment().add(10, 'minutes').toDate();

    // Hash token sebelum disimpan untuk keamanan
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Simpan token ke database (tabel password_resets)
    await PasswordReset.create({
      user_id: user.user_id,
      reset_token: hashedToken,
      reset_token_expiry: tokenExpiry
    });

    // Buat URL reset password
    const resetUrl = `${process.env.FRONTEND_URL}/resetpassword?token=${resetToken}&email=${email}`;

    // Konfigurasi email
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
      text: `Klik link berikut untuk mereset password Anda: ${resetUrl}\nLink ini berlaku selama 10 menit.`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Link reset password telah dikirim ke email Anda' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mengirim link reset password' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token tidak valid atau tidak ada' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Hash token yang dikirim oleh user
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Cari token yang valid di tabel password_resets
    const passwordReset = await PasswordReset.findOne({
      where: {
        user_id: user.user_id,
        reset_token: hashedToken,
        reset_token_expiry: { [Op.gt]: new Date() } // Token belum expired
      }
    });

    if (!passwordReset) {
      return res.status(400).json({ message: 'Token tidak valid atau sudah kadaluarsa' });
    }

    // Hash password baru sebelum menyimpan ke database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Hapus token setelah digunakan
    await PasswordReset.destroy({ where: { user_id: user.user_id } });

    return res.status(200).json({ message: 'Password berhasil direset' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Terjadi kesalahan saat mereset password' });
  }
};
