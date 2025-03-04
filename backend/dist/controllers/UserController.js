"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _modelsUserModelJs = require("../models/UserModel.js");

var _modelsUserModelJs2 = _interopRequireDefault(_modelsUserModelJs);

var _modelsFishExpertsModelJs = require("../models/FishExpertsModel.js");

var _modelsFishExpertsModelJs2 = _interopRequireDefault(_modelsFishExpertsModelJs);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

require("regenerator-runtime/runtime");

// Fungsi login pengguna
var loginUser = function loginUser(req, res) {
  var _req$body, email, password, user, role, userId, isMatch, token;

  return regeneratorRuntime.async(function loginUser$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        _req$body = req.body;
        email = _req$body.email;
        password = _req$body.password;
        context$1$0.next = 6;
        return regeneratorRuntime.awrap(_modelsUserModelJs2["default"].findOne({ where: { email: email } }));

      case 6:
        user = context$1$0.sent;
        role = 'user';
        userId = null;

        if (user) {
          context$1$0.next = 19;
          break;
        }

        context$1$0.next = 12;
        return regeneratorRuntime.awrap(_modelsFishExpertsModelJs2["default"].findOne({ where: { email: email } }));

      case 12:
        user = context$1$0.sent;

        role = 'expert'; // Ubah role jika ditemukan di tabel FishExpert

        if (user) {
          context$1$0.next = 16;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: 'Email atau password salah' }));

      case 16:

        userId = user.fishExperts_id; // Ambil ID dari tabel FishExperts
        context$1$0.next = 20;
        break;

      case 19:
        userId = user.user_id; // Ambil ID dari tabel User

      case 20:
        context$1$0.next = 22;
        return regeneratorRuntime.awrap(_bcryptjs2["default"].compare(password, user.password));

      case 22:
        isMatch = context$1$0.sent;

        if (isMatch) {
          context$1$0.next = 25;
          break;
        }

        return context$1$0.abrupt("return", res.status(400).json({ message: 'Email atau password salah' }));

      case 25:
        token = _jsonwebtoken2["default"].sign({ id: userId, name: user.name, email: user.email, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Mengirimkan respons sukses dengan token
        res.status(200).json({
          message: 'Login berhasil',
          token: token,
          user: {
            id: userId, // Gunakan ID yang sesuai (user_id atau fishExperts_id)
            name: user.name,
            email: user.email,
            role: role
          }
        });
        context$1$0.next = 33;
        break;

      case 29:
        context$1$0.prev = 29;
        context$1$0.t0 = context$1$0["catch"](0);

        console.error(context$1$0.t0);
        res.status(500).json({ message: 'Terjadi kesalahan saat login', error: context$1$0.t0.message });

      case 33:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 29]]);
};

exports.loginUser = loginUser;
// }
var getAllUsers = function getAllUsers(req, res) {
  var users;
  return regeneratorRuntime.async(function getAllUsers$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsUserModelJs2["default"].findAll());

      case 3:
        users = context$1$0.sent;

        res.status(200).json(users);
        context$1$0.next = 10;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: 'Gagal mengambil data pengguna', error: context$1$0.t0 });

      case 10:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 7]]);
};

exports.getAllUsers = getAllUsers;
// Fungsi untuk mendapatkan pengguna berdasarkan ID
var getUserById = function getUserById(req, res) {
  var user;
  return regeneratorRuntime.async(function getUserById$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsUserModelJs2["default"].findByPk(req.params.id));

      case 3:
        user = context$1$0.sent;

        if (user) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: 'Pengguna tidak ditemukan' }));

      case 6:
        res.status(200).json(user);
        context$1$0.next = 12;
        break;

      case 9:
        context$1$0.prev = 9;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: 'Gagal mengambil data pengguna', error: context$1$0.t0 });

      case 12:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 9]]);
};

exports.getUserById = getUserById;
// Fungsi untuk menambahkan pengguna baru
var createUser = function createUser(req, res) {
  var _req$body2, _name, email, password, address, role, existingUser, hashedPassword, newUser;

  return regeneratorRuntime.async(function createUser$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        _req$body2 = req.body;
        _name = _req$body2.name;
        email = _req$body2.email;
        password = _req$body2.password;
        address = _req$body2.address;
        role = _req$body2.role;
        context$1$0.next = 9;
        return regeneratorRuntime.awrap(_modelsUserModelJs2["default"].findOne({ where: { email: email } }));

      case 9:
        existingUser = context$1$0.sent;

        if (!existingUser) {
          context$1$0.next = 12;
          break;
        }

        return context$1$0.abrupt("return", res.status(400).json({ message: 'Email sudah terdaftar' }));

      case 12:
        context$1$0.next = 14;
        return regeneratorRuntime.awrap(_bcryptjs2["default"].hash(password, 10));

      case 14:
        hashedPassword = context$1$0.sent;
        context$1$0.next = 17;
        return regeneratorRuntime.awrap(_modelsUserModelJs2["default"].create({
          name: _name,
          email: email,
          password: hashedPassword, // Menyimpan password yang terenkripsi
          address: address,
          role: role
        }));

      case 17:
        newUser = context$1$0.sent;

        // Kirimkan respons sukses jika berhasil membuat pengguna baru
        res.status(201).json({ message: 'Pengguna berhasil ditambahkan', newUser: newUser });
        context$1$0.next = 25;
        break;

      case 21:
        context$1$0.prev = 21;
        context$1$0.t0 = context$1$0["catch"](0);

        // Tangani error lain
        console.error(context$1$0.t0);
        res.status(500).json({ message: 'Gagal menambahkan pengguna', error: context$1$0.t0.message });

      case 25:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 21]]);
};

exports.createUser = createUser;
// Fungsi untuk memperbarui data pengguna
var updateUser = function updateUser(req, res) {
  var user, _req$body3, _name2, email, password, address, province, city, district, village, phone_number, image, role, updatedData;

  return regeneratorRuntime.async(function updateUser$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsUserModelJs2["default"].findByPk(req.params.id));

      case 3:
        user = context$1$0.sent;

        if (user) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: 'Pengguna tidak ditemukan' }));

      case 6:
        _req$body3 = req.body;
        _name2 = _req$body3.name;
        email = _req$body3.email;
        password = _req$body3.password;
        address = _req$body3.address;
        province = _req$body3.province;
        city = _req$body3.city;
        district = _req$body3.district;
        village = _req$body3.village;
        phone_number = _req$body3.phone_number;
        image = _req$body3.image;
        role = _req$body3.role;
        updatedData = { name: _name2, email: email, address: address, province: province, city: city, district: district, village: village, phone_number: phone_number, image: image, role: role };

        if (!password) {
          context$1$0.next = 23;
          break;
        }

        context$1$0.next = 22;
        return regeneratorRuntime.awrap(_bcryptjs2["default"].hash(password, 10));

      case 22:
        updatedData.password = context$1$0.sent;

      case 23:
        context$1$0.next = 25;
        return regeneratorRuntime.awrap(user.update(updatedData));

      case 25:

        res.status(200).json({ message: 'Pengguna berhasil diperbarui', user: user });
        context$1$0.next = 32;
        break;

      case 28:
        context$1$0.prev = 28;
        context$1$0.t0 = context$1$0["catch"](0);

        console.error('Error updating user:', context$1$0.t0);
        res.status(500).json({ message: 'Gagal memperbarui pengguna', error: context$1$0.t0 });

      case 32:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 28]]);
};

exports.updateUser = updateUser;
var getMe = function getMe(req, res) {
  var _req$user, userId, role, fishExpert, user;

  return regeneratorRuntime.async(function getMe$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        _req$user = req.user;
        userId = _req$user.id;
        role = _req$user.role;
        // Ambil ID dan role dari token
        console.log('User ID from token:', userId);
        console.log('Role from token:', role);

        if (!(role === 'expert')) {
          context$1$0.next = 14;
          break;
        }

        // Jika role adalah 'expert', cari di tabel FishExperts
        console.log('Role is expert, looking in fishexperts...');
        context$1$0.next = 10;
        return regeneratorRuntime.awrap(_modelsFishExpertsModelJs2["default"].findByPk(userId));

      case 10:
        fishExpert = context$1$0.sent;

        if (fishExpert) {
          context$1$0.next = 13;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: 'Expert tidak ditemukan di fishexperts' }));

      case 13:
        return context$1$0.abrupt("return", res.status(200).json({
          id: fishExpert.fishExperts_id,
          name: fishExpert.name,
          email: fishExpert.email,
          phone_number: fishExpert.phone_number,
          specialization: fishExpert.specialization,
          experience: fishExpert.experience,
          created_at: fishExpert.created_at,
          image: fishExpert.image_url,
          role: 'expert'
        }));

      case 14:
        context$1$0.next = 16;
        return regeneratorRuntime.awrap(_modelsUserModelJs2["default"].findByPk(userId));

      case 16:
        user = context$1$0.sent;

        if (user) {
          context$1$0.next = 19;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: 'Pengguna tidak ditemukan di users' }));

      case 19:
        return context$1$0.abrupt("return", res.status(200).json({
          id: user.user_id,
          name: user.name,
          email: user.email,
          phone_number: user.phone_number,
          address: user.address,
          image: user.image,
          created_at: user.created_at,
          role: 'user'
        }));

      case 22:
        context$1$0.prev = 22;
        context$1$0.t0 = context$1$0["catch"](0);

        console.error('Error in getMe:', context$1$0.t0);
        res.status(500).json({ message: 'Gagal mengambil data pengguna', error: context$1$0.t0.message });

      case 26:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 22]]);
};

exports.getMe = getMe;
var updatePassword = function updatePassword(req, res) {
  var userId, _req$body4,

  // Ambil data dari request body
  currentPassword, newPassword, user, isMatch, salt, hashedPassword;

  return regeneratorRuntime.async(function updatePassword$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        userId = req.user.id;
        _req$body4 = req.body;
        currentPassword = _req$body4.currentPassword;
        newPassword = _req$body4.newPassword;

        if (!(!currentPassword || !newPassword)) {
          context$1$0.next = 7;
          break;
        }

        return context$1$0.abrupt("return", res.status(400).json({ message: "Semua kolom harus diisi." }));

      case 7:
        context$1$0.next = 9;
        return regeneratorRuntime.awrap(_modelsUserModelJs2["default"].findByPk(userId));

      case 9:
        user = context$1$0.sent;

        if (user) {
          context$1$0.next = 12;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: "User tidak ditemukan." }));

      case 12:
        if (user.password) {
          context$1$0.next = 14;
          break;
        }

        return context$1$0.abrupt("return", res.status(500).json({ message: "Password lama tidak ditemukan di database." }));

      case 14:
        context$1$0.next = 16;
        return regeneratorRuntime.awrap(_bcryptjs2["default"].compare(currentPassword, user.password));

      case 16:
        isMatch = context$1$0.sent;

        if (isMatch) {
          context$1$0.next = 19;
          break;
        }

        return context$1$0.abrupt("return", res.status(400).json({ message: "Kata sandi saat ini salah." }));

      case 19:
        context$1$0.next = 21;
        return regeneratorRuntime.awrap(_bcryptjs2["default"].genSalt(10));

      case 21:
        salt = context$1$0.sent;
        context$1$0.next = 24;
        return regeneratorRuntime.awrap(_bcryptjs2["default"].hash(newPassword, salt));

      case 24:
        hashedPassword = context$1$0.sent;

        // Simpan password baru ke database
        user.password = hashedPassword;
        context$1$0.next = 28;
        return regeneratorRuntime.awrap(user.save());

      case 28:

        res.json({ message: "Kata sandi berhasil diperbarui." });
        context$1$0.next = 35;
        break;

      case 31:
        context$1$0.prev = 31;
        context$1$0.t0 = context$1$0["catch"](0);

        console.error("Error updating password:", context$1$0.t0);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });

      case 35:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 31]]);
};

exports.updatePassword = updatePassword;
var updateProfile = function updateProfile(req, res) {
  var userId, _req$body5, // Asumsikan user ID disimpan di req.user setelah autentikasi
  _name3, address, province, city, district, village, phone_number, image, user;

  return regeneratorRuntime.async(function updateProfile$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        userId = req.user.id;
        _req$body5 = req.body;
        _name3 = _req$body5.name;
        address = _req$body5.address;
        province = _req$body5.province;
        city = _req$body5.city;
        district = _req$body5.district;
        village = _req$body5.village;
        phone_number = _req$body5.phone_number;
        image = _req$body5.image;
        context$1$0.next = 13;
        return regeneratorRuntime.awrap(_modelsUserModelJs2["default"].findByPk(userId));

      case 13:
        user = context$1$0.sent;

        if (user) {
          context$1$0.next = 16;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: 'User not found' }));

      case 16:

        user.name = _name3 || user.name;
        user.address = address || user.address;
        user.province = province || user.province;
        user.city = city || user.city;
        user.district = district || user.district;
        user.village = village || user.village;
        user.phone_number = phone_number || user.phone_number;
        user.image = image || user.image;

        context$1$0.next = 26;
        return regeneratorRuntime.awrap(user.save());

      case 26:

        res.status(200).json({ message: 'Profile updated successfully', user: user });
        context$1$0.next = 33;
        break;

      case 29:
        context$1$0.prev = 29;
        context$1$0.t0 = context$1$0["catch"](0);

        console.error('Error updating profile:', context$1$0.t0);
        res.status(500).json({ message: 'Server error' });

      case 33:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 29]]);
};
exports.updateProfile = updateProfile;

// Mencari pengguna di tabel User terlebih dahulu
// Default role
// Variabel untuk menyimpan ID pengguna

// Jika tidak ditemukan di tabel User, cari di tabel FishExpert

// Jika tidak ditemukan di kedua tabel

// Memverifikasi apakah password cocok

// Membuat token JWT
// Perbaiki 'user' menjadi 'User'

// Cek apakah email sudah terdaftar

// Jika email sudah terdaftar, kirimkan pesan error

// Enkripsi password menggunakan bcrypt
// 10 adalah jumlah salt rounds

// Jika email belum terdaftar, lanjutkan untuk membuat pengguna baru

// Membuat objek update data

// Jika password diberikan, enkripsi password baru

// Update data user
// Mencari di tabel FishExperts

// Jika role adalah 'user', cari di tabel Users

// Ambil user ID dari token

// Validasi input

// Ambil data user dari database

// Pastikan password lama yang dimasukkan tidak undefined

// Cek apakah password lama cocok

// Hash password baru