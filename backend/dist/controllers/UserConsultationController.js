"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _modelsUserConsultationModelJs = require("../models/UserConsultationModel.js");

var _modelsUserConsultationModelJs2 = _interopRequireDefault(_modelsUserConsultationModelJs);

var _expressValidator = require("express-validator");

// Untuk validasi input

var _configDatabaseJs = require("../config/Database.js");

var _configDatabaseJs2 = _interopRequireDefault(_configDatabaseJs);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

require("regenerator-runtime/runtime");

// Fungsi untuk mendapatkan semua data konsultasi
var getAllUserConsultations = function getAllUserConsultations(req, res) {
  var consultations;
  return regeneratorRuntime.async(function getAllUserConsultations$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsUserConsultationModelJs2["default"].findAll({
          attributes: ["user_consultation_id", "user_id", "fish_type_id", "fish_age", "fish_length", "consultation_topic", "fish_image", "fish_weight", "complaint", "consultation_status"]
        }));

      case 3:
        consultations = context$1$0.sent;

        if (!(consultations.length === 0)) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: "Belum ada data konsultasi." }));

      case 6:

        res.status(200).json({ data: consultations });
        context$1$0.next = 12;
        break;

      case 9:
        context$1$0.prev = 9;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: "Gagal mengambil data konsultasi.", error: context$1$0.t0.message });

      case 12:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 9]]);
};

exports.getAllUserConsultations = getAllUserConsultations;
// Fungsi untuk mendapatkan data konsultasi berdasarkan ID
var getUserConsultationById = function getUserConsultationById(req, res) {
  var id, consultation;
  return regeneratorRuntime.async(function getUserConsultationById$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        id = req.params.id;

        if (id) {
          context$1$0.next = 4;
          break;
        }

        return context$1$0.abrupt("return", res.status(400).json({ message: "ID konsultasi diperlukan." }));

      case 4:
        context$1$0.next = 6;
        return regeneratorRuntime.awrap(_modelsUserConsultationModelJs2["default"].findByPk(id, {
          attributes: { exclude: ["createdAt", "updatedAt"] }
        }));

      case 6:
        consultation = context$1$0.sent;

        if (consultation) {
          context$1$0.next = 9;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: "Konsultasi tidak ditemukan." }));

      case 9:
        return context$1$0.abrupt("return", res.status(200).json({
          success: true,
          message: "Data konsultasi berhasil diambil.",
          data: consultation
        }));

      case 12:
        context$1$0.prev = 12;
        context$1$0.t0 = context$1$0["catch"](0);

        // Menangani error internal server
        console.error("Error fetching consultation:", context$1$0.t0);
        return context$1$0.abrupt("return", res.status(500).json({
          success: false,
          message: "Terjadi kesalahan saat mengambil data konsultasi.",
          error: context$1$0.t0.message
        }));

      case 16:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 12]]);
};

exports.getUserConsultationById = getUserConsultationById;
var getUserConsultationHistory = function getUserConsultationHistory(req, res) {
  var token, decodedToken, userId, consultations;
  return regeneratorRuntime.async(function getUserConsultationHistory$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;

        if (token) {
          context$1$0.next = 3;
          break;
        }

        return context$1$0.abrupt("return", res.status(401).json({ message: "Token tidak ditemukan." }));

      case 3:
        context$1$0.prev = 3;
        decodedToken = _jsonwebtoken2["default"].verify(token, process.env.JWT_SECRET);

        console.log("Decoded Token:", decodedToken); // Debugging log
        userId = decodedToken.id;

        if (userId) {
          context$1$0.next = 9;
          break;
        }

        return context$1$0.abrupt("return", res.status(400).json({
          success: false,
          message: "User ID tidak ditemukan dalam token."
        }));

      case 9:

        console.log("User ID:", userId); // Debug log

        // Query ke database
        context$1$0.next = 12;
        return regeneratorRuntime.awrap(_modelsUserConsultationModelJs2["default"].findAll({
          where: { user_id: userId }, // Filter berdasarkan user_id
          attributes: ["user_consultation_id", "fish_type_id", "fish_age", "fish_length", "fish_weight", "consultation_topic", "fish_image", "complaint", "consultation_status", "created_at"],
          order: [["created_at", "DESC"]]
        }));

      case 12:
        consultations = context$1$0.sent;

        if (!(consultations.length === 0)) {
          context$1$0.next = 15;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: "Belum ada riwayat konsultasi." }));

      case 15:

        res.status(200).json({
          success: true,
          data: consultations
        });
        context$1$0.next = 22;
        break;

      case 18:
        context$1$0.prev = 18;
        context$1$0.t0 = context$1$0["catch"](3);

        console.error("Error saat mengambil riwayat konsultasi:", context$1$0.t0.message); // Debug log
        res.status(500).json({
          success: false,
          message: "Gagal mengambil riwayat konsultasi.",
          error: context$1$0.t0.message
        });

      case 22:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[3, 18]]);
};

exports.getUserConsultationHistory = getUserConsultationHistory;
// Fungsi untuk menambahkan konsultasi baru
var createUserConsultation = function createUserConsultation(req, res) {
  var errors, _req$body, user_id, fish_type_id, fish_age, fish_length, fish_weight, consultation_topic, fish_image, complaint, consultation_status, transaction, newConsultation, responseData;

  return regeneratorRuntime.async(function createUserConsultation$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        errors = (0, _expressValidator.validationResult)(req);

        if (errors.isEmpty()) {
          context$1$0.next = 3;
          break;
        }

        return context$1$0.abrupt("return", res.status(400).json({
          message: "Harap mengisi semua kolom yang tersedia!",
          errors: errors.array()
        }));

      case 3:
        _req$body = req.body;
        user_id = _req$body.user_id;
        fish_type_id = _req$body.fish_type_id;
        fish_age = _req$body.fish_age;
        fish_length = _req$body.fish_length;
        fish_weight = _req$body.fish_weight;
        consultation_topic = _req$body.consultation_topic;
        fish_image = _req$body.fish_image;
        complaint = _req$body.complaint;
        consultation_status = _req$body.consultation_status;

        console.log("Received Data from Client:", req.body);

        context$1$0.next = 16;
        return regeneratorRuntime.awrap(_configDatabaseJs2["default"].transaction());

      case 16:
        transaction = context$1$0.sent;
        context$1$0.prev = 17;
        context$1$0.next = 20;
        return regeneratorRuntime.awrap(_modelsUserConsultationModelJs2["default"].create({
          user_id: user_id,
          fish_type_id: fish_type_id,
          fish_age: fish_age,
          fish_length: fish_length,
          fish_weight: fish_weight,
          consultation_topic: consultation_topic,
          fish_image: fish_image,
          complaint: complaint,
          consultation_status: consultation_status
        }, { transaction: transaction }));

      case 20:
        newConsultation = context$1$0.sent;

        console.log("newConsultation Data Values:", newConsultation.dataValues);

        context$1$0.next = 24;
        return regeneratorRuntime.awrap(transaction.commit());

      case 24:
        responseData = {
          id: newConsultation.dataValues.user_consultation_id,
          user_consultation_id: newConsultation.dataValues.user_consultation_id
        };

        console.log("Respons yang Dikembalikan ke Frontend:", responseData);

        res.status(201).json({
          message: "Konsultasi berhasil ditambahkan!",
          data: responseData
        });
        context$1$0.next = 35;
        break;

      case 29:
        context$1$0.prev = 29;
        context$1$0.t0 = context$1$0["catch"](17);
        context$1$0.next = 33;
        return regeneratorRuntime.awrap(transaction.rollback());

      case 33:
        console.error("Error saat menyimpan konsultasi:", context$1$0.t0);
        res.status(500).json({
          message: "Gagal menambahkan konsultasi",
          error: context$1$0.t0.message
        });

      case 35:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[17, 29]]);
};
exports.createUserConsultation = createUserConsultation;

// Validasi apakah ID diberikan

// Mencari data konsultasi berdasarkan ID

// Jika data tidak ditemukan

// Jika berhasil ditemukan

// Decode token
// Ambil `id` dari token