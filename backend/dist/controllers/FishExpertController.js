"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _modelsFishExpertsModelJs = require("../models/FishExpertsModel.js");

var _modelsFishExpertsModelJs2 = _interopRequireDefault(_modelsFishExpertsModelJs);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

require("regenerator-runtime/runtime");

// Mendapatkan semua data Fish Experts
var getAllFishExperts = function getAllFishExperts(req, res) {
  var experts;
  return regeneratorRuntime.async(function getAllFishExperts$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsFishExpertsModelJs2["default"].findAll());

      case 3:
        experts = context$1$0.sent;

        res.status(200).json(experts);
        context$1$0.next = 10;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: "Gagal mengambil data Fish Experts", error: context$1$0.t0 });

      case 10:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 7]]);
};

exports.getAllFishExperts = getAllFishExperts;
// Mendapatkan Fish Expert berdasarkan ID
var getFishExpertById = function getFishExpertById(req, res) {
  var expert;
  return regeneratorRuntime.async(function getFishExpertById$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsFishExpertsModelJs2["default"].findByPk(req.params.id));

      case 3:
        expert = context$1$0.sent;

        if (expert) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: "Fish Expert tidak ditemukan" }));

      case 6:
        res.status(200).json(expert);
        context$1$0.next = 12;
        break;

      case 9:
        context$1$0.prev = 9;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: "Gagal mengambil data Fish Expert", error: context$1$0.t0 });

      case 12:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 9]]);
};

exports.getFishExpertById = getFishExpertById;
// Menambahkan Fish Expert baru
var createFishExpert = function createFishExpert(req, res) {
  var _req$body, _name, email, password, phone_number, specialization, experience, existingExpert, hashedPassword, newExpert;

  return regeneratorRuntime.async(function createFishExpert$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        _req$body = req.body;
        _name = _req$body.name;
        email = _req$body.email;
        password = _req$body.password;
        phone_number = _req$body.phone_number;
        specialization = _req$body.specialization;
        experience = _req$body.experience;
        context$1$0.next = 10;
        return regeneratorRuntime.awrap(_modelsFishExpertsModelJs2["default"].findOne({ where: { email: email } }));

      case 10:
        existingExpert = context$1$0.sent;

        if (!existingExpert) {
          context$1$0.next = 13;
          break;
        }

        return context$1$0.abrupt("return", res.status(400).json({ message: "Email sudah terdaftar" }));

      case 13:
        context$1$0.next = 15;
        return regeneratorRuntime.awrap(_bcryptjs2["default"].hash(password, 10));

      case 15:
        hashedPassword = context$1$0.sent;
        context$1$0.next = 18;
        return regeneratorRuntime.awrap(_modelsFishExpertsModelJs2["default"].create({
          name: _name,
          email: email,
          password: hashedPassword, // Simpan password yang sudah dienkripsi
          phone_number: phone_number,
          specialization: specialization,
          experience: experience,
          image_url: image_url
        }));

      case 18:
        newExpert = context$1$0.sent;

        res.status(201).json({
          message: "Fish Expert berhasil ditambahkan",
          data: {
            id: newExpert.fishExperts_id,
            name: newExpert.name,
            email: newExpert.email,
            phone_number: newExpert.phone_number,
            specialization: newExpert.specialization,
            experience: newExpert.experience,
            image: newExpert.image_url
          }
        });
        context$1$0.next = 26;
        break;

      case 22:
        context$1$0.prev = 22;
        context$1$0.t0 = context$1$0["catch"](0);

        console.error(context$1$0.t0);
        res.status(500).json({ message: "Gagal menambahkan Fish Expert", error: context$1$0.t0.message });

      case 26:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 22]]);
};

exports.createFishExpert = createFishExpert;
var updateFishExpertPassword = function updateFishExpertPassword(req, res) {
  var fishExpertId, _req$body2,

  // Ambil data dari request body
  currentPassword, newPassword, fishExpert, isMatch, salt, hashedPassword;

  return regeneratorRuntime.async(function updateFishExpertPassword$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        fishExpertId = req.user.id;
        _req$body2 = req.body;
        currentPassword = _req$body2.currentPassword;
        newPassword = _req$body2.newPassword;

        if (!(!currentPassword || !newPassword)) {
          context$1$0.next = 7;
          break;
        }

        return context$1$0.abrupt("return", res.status(400).json({ message: "Semua kolom harus diisi." }));

      case 7:
        context$1$0.next = 9;
        return regeneratorRuntime.awrap(_modelsFishExpertsModelJs2["default"].findByPk(fishExpertId));

      case 9:
        fishExpert = context$1$0.sent;

        if (fishExpert) {
          context$1$0.next = 12;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: "Fish Expert tidak ditemukan." }));

      case 12:
        if (fishExpert.password) {
          context$1$0.next = 14;
          break;
        }

        return context$1$0.abrupt("return", res.status(500).json({ message: "Password lama tidak ditemukan di database." }));

      case 14:
        context$1$0.next = 16;
        return regeneratorRuntime.awrap(_bcryptjs2["default"].compare(currentPassword, fishExpert.password));

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
        fishExpert.password = hashedPassword;
        context$1$0.next = 28;
        return regeneratorRuntime.awrap(fishExpert.save());

      case 28:

        res.json({ message: "Kata sandi berhasil diperbarui." });
        context$1$0.next = 35;
        break;

      case 31:
        context$1$0.prev = 31;
        context$1$0.t0 = context$1$0["catch"](0);

        console.error("Error updating fish expert password:", context$1$0.t0);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });

      case 35:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 31]]);
};
exports.updateFishExpertPassword = updateFishExpertPassword;

// Cek apakah email sudah terdaftar

// Enkripsi password sebelum disimpan ke database
// 10 adalah jumlah salt rounds

// Membuat entri baru di tabel FishExperts

// Ambil fishExpert ID dari token

// Validasi input

// Ambil data fishExpert dari database

// Pastikan password lama yang disimpan di database ada

// Cek apakah password lama cocok

// Hash password baru