import User from '../models/UserModel.js';
import OtpVerification from '../models/OtpVerificationModel.js';
import { Op } from 'sequelize';
import moment from 'moment';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';

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
