'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _modelsUserModelJs = require('../models/UserModel.js');

var _modelsUserModelJs2 = _interopRequireDefault(_modelsUserModelJs);

var _modelsOtpVerificationModelJs = require('../models/OtpVerificationModel.js');

var _modelsOtpVerificationModelJs2 = _interopRequireDefault(_modelsOtpVerificationModelJs);

var _sequelize = require('sequelize');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _modelsPasswordResetModelJs = require('../models/PasswordResetModel.js');

var _modelsPasswordResetModelJs2 = _interopRequireDefault(_modelsPasswordResetModelJs);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

require("regenerator-runtime/runtime");

_dotenv2['default'].config();

var startRegistration = function startRegistration(req, res) {
  var email, existingUser, otp_code, otp_expiry, transporter, mailOptions;
  return regeneratorRuntime.async(function startRegistration$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        email = req.body.email;
        context$1$0.prev = 1;
        context$1$0.next = 4;
        return regeneratorRuntime.awrap(_modelsUserModelJs2['default'].findOne({ where: { email: email } }));

      case 4:
        existingUser = context$1$0.sent;

        if (!existingUser) {
          context$1$0.next = 7;
          break;
        }

        return context$1$0.abrupt('return', res.status(400).json({ message: 'Email sudah terdaftar' }));

      case 7:
        otp_code = Math.floor(100000 + Math.random() * 900000).toString();
        otp_expiry = (0, _moment2['default'])().add(15, 'minutes').toDate();
        context$1$0.next = 11;
        return regeneratorRuntime.awrap(_modelsOtpVerificationModelJs2['default'].create({
          email: email,
          otp_code: otp_code,
          otp_expiry: otp_expiry,
          is_verified: false
        }));

      case 11:
        transporter = _nodemailer2['default'].createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        mailOptions = {
          from: '"Dokter Ikan" <' + process.env.EMAIL_USER + '>',
          to: email,
          subject: 'OTP untuk Registrasi Akun di Aplikasi Dokter Ikan',
          text: 'Halo,\n\nTerima kasih telah mendaftar di Aplikasi Dokter Ikan! Untuk melanjutkan proses registrasi, kami telah mengirimkan kode OTP (One-Time Password) untuk verifikasi email Anda.\n\nKode OTP Anda adalah: ' + otp_code + '\n\nPastikan kode ini tidak dibagikan dengan siapa pun. Kode OTP ini berlaku selama 15 menit. Setelah berhasil memverifikasi OTP, Anda dapat melanjutkan ke langkah berikutnya dalam registrasi.\n\nJika Anda tidak melakukan registrasi ini, silakan abaikan email ini.\n\nSalam hangat,  \nTim Dokter Ikan'
        };
        context$1$0.next = 15;
        return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

      case 15:
        return context$1$0.abrupt('return', res.status(200).json({ message: 'OTP telah dikirim ke email Anda.' }));

      case 18:
        context$1$0.prev = 18;
        context$1$0.t0 = context$1$0['catch'](1);

        console.error('Error sending email:', context$1$0.t0);

        // Tangani error dengan baik
        return context$1$0.abrupt('return', res.status(500).json({ message: 'Terjadi kesalahan, coba lagi nanti.' }));

      case 22:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[1, 18]]);
};

exports.startRegistration = startRegistration;
// Fungsi untuk verifikasi OTP
var verifyOtp = function verifyOtp(req, res) {
  var _req$body, email, otp_code, otpRecord;

  return regeneratorRuntime.async(function verifyOtp$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _req$body = req.body;
        email = _req$body.email;
        otp_code = _req$body.otp_code;

        console.log('Received email:', email);
        console.log('Received otp_code:', otp_code);

        context$1$0.prev = 5;
        context$1$0.next = 8;
        return regeneratorRuntime.awrap(_modelsOtpVerificationModelJs2['default'].findOne({
          where: {
            email: email,
            otp_code: otp_code,
            otp_expiry: _defineProperty({}, _sequelize.Op.gte, (0, _moment2['default'])().toDate()), // Pastikan `moment().toDate()` mengembalikan tipe data yang benar
            is_verified: false
          }
        }));

      case 8:
        otpRecord = context$1$0.sent;

        if (otpRecord) {
          context$1$0.next = 11;
          break;
        }

        return context$1$0.abrupt('return', res.status(400).json({ message: 'Kode OTP tidak valid atau telah kadaluarsa' }));

      case 11:

        // Tandai OTP sebagai terverifikasi
        otpRecord.is_verified = true;
        context$1$0.next = 14;
        return regeneratorRuntime.awrap(otpRecord.save());

      case 14:
        return context$1$0.abrupt('return', res.status(200).json({ message: 'OTP berhasil diverifikasi, lanjutkan ke pengisian data' }));

      case 17:
        context$1$0.prev = 17;
        context$1$0.t0 = context$1$0['catch'](5);

        console.error(context$1$0.t0);
        return context$1$0.abrupt('return', res.status(500).json({ message: 'Terjadi kesalahan, coba lagi nanti' }));

      case 21:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[5, 17]]);
};

exports.verifyOtp = verifyOtp;
// Fungsi untuk melengkapi pendaftaran setelah OTP diverifikasi
var completeRegistration = function completeRegistration(req, res) {
  var _req$body2, email, name, password, address, otpRecord, hashedPassword, newUser;

  return regeneratorRuntime.async(function completeRegistration$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _req$body2 = req.body;
        email = _req$body2.email;
        name = _req$body2.name;
        password = _req$body2.password;
        address = _req$body2.address;
        context$1$0.prev = 5;
        context$1$0.next = 8;
        return regeneratorRuntime.awrap(_modelsOtpVerificationModelJs2['default'].findOne({
          where: {
            email: email,
            is_verified: true
          }
        }));

      case 8:
        otpRecord = context$1$0.sent;

        if (otpRecord) {
          context$1$0.next = 11;
          break;
        }

        return context$1$0.abrupt('return', res.status(400).json({ message: 'OTP belum diverifikasi atau kadaluarsa' }));

      case 11:
        context$1$0.next = 13;
        return regeneratorRuntime.awrap(_bcryptjs2['default'].hash(password, 10));

      case 13:
        hashedPassword = context$1$0.sent;
        context$1$0.next = 16;
        return regeneratorRuntime.awrap(_modelsUserModelJs2['default'].create({
          email: email,
          name: name,
          password: hashedPassword,
          address: address
        }));

      case 16:
        newUser = context$1$0.sent;
        context$1$0.next = 19;
        return regeneratorRuntime.awrap(otpRecord.destroy());

      case 19:
        return context$1$0.abrupt('return', res.status(201).json({
          message: 'Registrasi berhasil. Akun Anda telah aktif',
          user: newUser
        }));

      case 22:
        context$1$0.prev = 22;
        context$1$0.t0 = context$1$0['catch'](5);

        console.error(context$1$0.t0);
        return context$1$0.abrupt('return', res.status(500).json({ message: 'Terjadi kesalahan, coba lagi nanti' }));

      case 26:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[5, 22]]);
};

exports.completeRegistration = completeRegistration;
var forgotPassword = function forgotPassword(req, res) {
  var email, user, resetToken, tokenExpiry, hashedToken, resetUrl, transporter, mailOptions;
  return regeneratorRuntime.async(function forgotPassword$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        email = req.body.email;
        context$1$0.prev = 1;
        context$1$0.next = 4;
        return regeneratorRuntime.awrap(_modelsUserModelJs2['default'].findOne({ where: { email: email } }));

      case 4:
        user = context$1$0.sent;

        if (user) {
          context$1$0.next = 7;
          break;
        }

        return context$1$0.abrupt('return', res.status(404).json({ message: 'User tidak ditemukan' }));

      case 7:
        resetToken = _crypto2['default'].randomBytes(32).toString('hex');
        tokenExpiry = (0, _moment2['default'])().add(10, 'minutes').toDate();
        hashedToken = _crypto2['default'].createHash('sha256').update(resetToken).digest('hex');
        context$1$0.next = 12;
        return regeneratorRuntime.awrap(_modelsPasswordResetModelJs2['default'].create({
          user_id: user.user_id,
          reset_token: hashedToken,
          reset_token_expiry: tokenExpiry
        }));

      case 12:
        resetUrl = process.env.FRONTEND_URL + '/resetpassword?token=' + resetToken + '&email=' + email;
        transporter = _nodemailer2['default'].createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        mailOptions = {
          from: '"Dokter Ikan" <' + process.env.EMAIL_USER + '>',
          to: email,
          subject: 'Reset Password Link',
          text: 'Klik link berikut untuk mereset password Anda: ' + resetUrl + '\nLink ini berlaku selama 10 menit.'
        };
        context$1$0.next = 17;
        return regeneratorRuntime.awrap(transporter.sendMail(mailOptions));

      case 17:
        return context$1$0.abrupt('return', res.status(200).json({ message: 'Link reset password telah dikirim ke email Anda' }));

      case 20:
        context$1$0.prev = 20;
        context$1$0.t0 = context$1$0['catch'](1);

        console.error(context$1$0.t0);
        return context$1$0.abrupt('return', res.status(500).json({ message: 'Terjadi kesalahan saat mengirim link reset password' }));

      case 24:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[1, 20]]);
};

exports.forgotPassword = forgotPassword;
var resetPassword = function resetPassword(req, res) {
  var _req$body3, email, token, newPassword, user, hashedToken, passwordReset, hashedPassword;

  return regeneratorRuntime.async(function resetPassword$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        _req$body3 = req.body;
        email = _req$body3.email;
        token = _req$body3.token;
        newPassword = _req$body3.newPassword;

        if (token) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt('return', res.status(400).json({ message: 'Token tidak valid atau tidak ada' }));

      case 6:
        context$1$0.prev = 6;
        context$1$0.next = 9;
        return regeneratorRuntime.awrap(_modelsUserModelJs2['default'].findOne({ where: { email: email } }));

      case 9:
        user = context$1$0.sent;

        if (user) {
          context$1$0.next = 12;
          break;
        }

        return context$1$0.abrupt('return', res.status(404).json({ message: 'User tidak ditemukan' }));

      case 12:
        hashedToken = _crypto2['default'].createHash('sha256').update(token).digest('hex');
        context$1$0.next = 15;
        return regeneratorRuntime.awrap(_modelsPasswordResetModelJs2['default'].findOne({
          where: {
            user_id: user.user_id,
            reset_token: hashedToken,
            reset_token_expiry: _defineProperty({}, _sequelize.Op.gt, new Date()) // Token belum expired
          }
        }));

      case 15:
        passwordReset = context$1$0.sent;

        if (passwordReset) {
          context$1$0.next = 18;
          break;
        }

        return context$1$0.abrupt('return', res.status(400).json({ message: 'Token tidak valid atau sudah kadaluarsa' }));

      case 18:
        context$1$0.next = 20;
        return regeneratorRuntime.awrap(_bcryptjs2['default'].hash(newPassword, 10));

      case 20:
        hashedPassword = context$1$0.sent;

        user.password = hashedPassword;
        context$1$0.next = 24;
        return regeneratorRuntime.awrap(user.save());

      case 24:
        context$1$0.next = 26;
        return regeneratorRuntime.awrap(_modelsPasswordResetModelJs2['default'].destroy({ where: { user_id: user.user_id } }));

      case 26:
        return context$1$0.abrupt('return', res.status(200).json({ message: 'Password berhasil direset' }));

      case 29:
        context$1$0.prev = 29;
        context$1$0.t0 = context$1$0['catch'](6);

        console.error(context$1$0.t0);
        return context$1$0.abrupt('return', res.status(500).json({ message: 'Terjadi kesalahan saat mereset password' }));

      case 33:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[6, 29]]);
};
exports.resetPassword = resetPassword;

// Cek apakah email sudah terdaftar

// Generate OTP dan waktu kadaluarsa

// Simpan OTP ke database

// Konfigurasi Nodemailer

// Kirim email

// Cari OTP yang sesuai dengan email dan kode OTP

// Cari OTP yang sudah terverifikasi

// Buat pengguna baru setelah OTP diverifikasi

// Hapus data OTP setelah selesai digunakan

// Generate token unik

// Hash token sebelum disimpan untuk keamanan

// Simpan token ke database (tabel password_resets)

// Buat URL reset password

// Konfigurasi email

// Hash token yang dikirim oleh user

// Cari token yang valid di tabel password_resets

// Hash password baru sebelum menyimpan ke database

// Hapus token setelah digunakan