'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsConsultationModelJs = require('../models/ConsultationModel.js');

var _modelsConsultationModelJs2 = _interopRequireDefault(_modelsConsultationModelJs);

var _modelsUserModelJs = require('../models/UserModel.js');

var _modelsUserModelJs2 = _interopRequireDefault(_modelsUserModelJs);

var _modelsUserConsultationModelJs = require('../models/UserConsultationModel.js');

var _modelsUserConsultationModelJs2 = _interopRequireDefault(_modelsUserConsultationModelJs);

var _modelsFishExpertsModelJs = require('../models/FishExpertsModel.js');

var _modelsFishExpertsModelJs2 = _interopRequireDefault(_modelsFishExpertsModelJs);

var _modelsFishExpertAnswerModelJs = require('../models/FishExpertAnswerModel.js');

var _modelsFishExpertAnswerModelJs2 = _interopRequireDefault(_modelsFishExpertAnswerModelJs);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _modelsFishTypeModelJs = require('../models/FishTypeModel.js');

var _modelsFishTypeModelJs2 = _interopRequireDefault(_modelsFishTypeModelJs);

require("regenerator-runtime/runtime");

// Fungsi untuk mendapatkan semua konsultasi
var getAllConsultations = function getAllConsultations(req, res) {
  var consultations;
  return regeneratorRuntime.async(function getAllConsultations$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsConsultationModelJs2['default'].findAll({
          include: [{ model: _modelsUserModelJs2['default'] }, { model: _modelsUserConsultationModelJs2['default'] }, { model: _modelsFishExpertsModelJs2['default'] }, { model: _modelsFishExpertAnswerModelJs2['default'] }]
        }));

      case 3:
        consultations = context$1$0.sent;

        res.status(200).json(consultations);
        context$1$0.next = 10;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0['catch'](0);

        res.status(500).json({ message: 'Gagal mengambil data konsultasi', error: context$1$0.t0 });

      case 10:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[0, 7]]);
};

exports.getAllConsultations = getAllConsultations;
// Fungsi untuk mendapatkan konsultasi berdasarkan ID
var getConsultationById = function getConsultationById(req, res) {
  var consultation;
  return regeneratorRuntime.async(function getConsultationById$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsConsultationModelJs2['default'].findByPk(req.params.id, {
          include: [{ model: _modelsUserModelJs2['default'], attributes: ['id', 'name', 'email'] }, // Pilih atribut spesifik untuk efisiensi
          { model: _modelsUserConsultationModelJs2['default'], attributes: ['id', 'consultation_topic', 'complaint'] }, { model: _modelsFishExpertsModelJs2['default'], attributes: ['id', 'name', 'specialization'] }, { model: _modelsFishExpertAnswerModelJs2['default'], attributes: ['id', 'answer', 'createdAt'] }]
        }));

      case 3:
        consultation = context$1$0.sent;

        if (consultation) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt('return', res.status(404).json({ message: 'Konsultasi tidak ditemukan' }));

      case 6:
        return context$1$0.abrupt('return', res.status(200).json(consultation));

      case 9:
        context$1$0.prev = 9;
        context$1$0.t0 = context$1$0['catch'](0);

        // Tangani error
        console.error('Error fetching consultation data:', context$1$0.t0);
        return context$1$0.abrupt('return', res.status(500).json({ message: 'Gagal mengambil data konsultasi', error: context$1$0.t0.message }));

      case 13:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[0, 9]]);
};

exports.getConsultationById = getConsultationById;
// Fungsi untuk membuat konsultasi baru
var createConsultation = function createConsultation(req, res) {
  var _req$body, user_id, user_consultation_id, _req$body$fishExpert_id, fishExpert_id, _req$body$fish_expert_answer_id, fish_expert_answer_id, _req$body$consultation_status, consultation_status, newConsultation;

  return regeneratorRuntime.async(function createConsultation$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        _req$body = req.body;
        user_id = _req$body.user_id;
        user_consultation_id = _req$body.user_consultation_id;
        _req$body$fishExpert_id = _req$body.fishExpert_id;
        fishExpert_id = _req$body$fishExpert_id === undefined ? null : _req$body$fishExpert_id;
        _req$body$fish_expert_answer_id = _req$body.fish_expert_answer_id;
        fish_expert_answer_id = _req$body$fish_expert_answer_id === undefined ? null : _req$body$fish_expert_answer_id;
        _req$body$consultation_status = _req$body.consultation_status;
        consultation_status = _req$body$consultation_status === undefined ? "Waiting" : _req$body$consultation_status;

        console.log("Received Data in createConsultation:", req.body);

        if (!(!user_id || !user_consultation_id)) {
          context$1$0.next = 13;
          break;
        }

        return context$1$0.abrupt('return', res.status(400).json({
          message: "user_id dan user_consultation_id wajib diisi"
        }));

      case 13:
        context$1$0.next = 15;
        return regeneratorRuntime.awrap(_modelsConsultationModelJs2['default'].create({
          user_id: user_id,
          user_consultation_id: user_consultation_id,
          fishExpert_id: fishExpert_id,
          fish_expert_answer_id: fish_expert_answer_id,
          consultation_status: consultation_status
        }));

      case 15:
        newConsultation = context$1$0.sent;

        console.log("Data Disimpan ke Tabel Consultations:", newConsultation);

        res.status(201).json({
          message: 'Konsultasi berhasil ditambahkan',
          data: newConsultation
        });
        context$1$0.next = 24;
        break;

      case 20:
        context$1$0.prev = 20;
        context$1$0.t0 = context$1$0['catch'](0);

        console.error('Error creating consultation:', context$1$0.t0);
        res.status(500).json({
          message: 'Gagal menambahkan konsultasi',
          error: context$1$0.t0.message
        });

      case 24:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[0, 20]]);
};

exports.createConsultation = createConsultation;
// Fungsi untuk memperbarui konsultasi berdasarkan ID
var updateConsultation = function updateConsultation(req, res) {
  var consultation, _req$body2, fish_expert_answer_id, consultation_status;

  return regeneratorRuntime.async(function updateConsultation$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsConsultationModelJs2['default'].findByPk(req.params.id));

      case 3:
        consultation = context$1$0.sent;

        if (consultation) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt('return', res.status(404).json({ message: 'Konsultasi tidak ditemukan' }));

      case 6:
        _req$body2 = req.body;
        fish_expert_answer_id = _req$body2.fish_expert_answer_id;
        consultation_status = _req$body2.consultation_status;

        // Log data yang diterima
        console.log('Received fish_expert_answer_id:', fish_expert_answer_id);
        console.log('Received consultation_status:', consultation_status);

        // Perbarui hanya kolom yang dibutuhkan
        context$1$0.next = 13;
        return regeneratorRuntime.awrap(consultation.update({
          fish_expert_answer_id: fish_expert_answer_id,
          consultation_status: consultation_status
        }));

      case 13:

        // Log data setelah diupdate
        console.log('Updated consultation:', consultation);

        res.status(200).json({ message: 'Konsultasi berhasil diperbarui', consultation: consultation });
        context$1$0.next = 21;
        break;

      case 17:
        context$1$0.prev = 17;
        context$1$0.t0 = context$1$0['catch'](0);

        console.error('Error updating consultation:', context$1$0.t0);
        res.status(500).json({ message: 'Gagal memperbarui konsultasi', error: context$1$0.t0 });

      case 21:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[0, 17]]);
};

exports.updateConsultation = updateConsultation;
var getConsultationHistory = function getConsultationHistory(req, res) {
  var token, decodedToken, userId, consultations;
  return regeneratorRuntime.async(function getConsultationHistory$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;

        if (token) {
          context$1$0.next = 3;
          break;
        }

        return context$1$0.abrupt('return', res.status(401).json({ message: "Token tidak ditemukan." }));

      case 3:
        context$1$0.prev = 3;
        decodedToken = _jsonwebtoken2['default'].verify(token, process.env.JWT_SECRET);
        userId = decodedToken.id;

        if (userId) {
          context$1$0.next = 8;
          break;
        }

        return context$1$0.abrupt('return', res.status(400).json({
          success: false,
          message: "User ID tidak ditemukan dalam token."
        }));

      case 8:

        console.log("User ID:", userId); // Debug log

        // Query ke database untuk mendapatkan riwayat konsultasi
        context$1$0.next = 11;
        return regeneratorRuntime.awrap(_modelsConsultationModelJs2['default'].findAll({
          where: { user_id: userId }, // Filter berdasarkan user_id
          attributes: ["consultation_id", "user_consultation_id", "fishExpert_id", "fish_expert_answer_id", "consultation_status"],
          include: [{
            model: _modelsUserConsultationModelJs2['default'],
            attributes: ["fish_type_id", "fish_age", "fish_length", "fish_weight", "consultation_topic", "fish_image", "complaint", "created_at"]
          }, {
            model: _modelsFishExpertsModelJs2['default'],
            attributes: ["name", "specialization"]
          }, {
            model: _modelsFishExpertAnswerModelJs2['default'],
            attributes: ["answer", "created_at"]
          }],
          order: [["consultation_id", "DESC"]],
          raw: true
        }));

      case 11:
        consultations = context$1$0.sent;

        if (!(consultations.length === 0)) {
          context$1$0.next = 14;
          break;
        }

        return context$1$0.abrupt('return', res.status(404).json({
          success: false,
          message: "Belum ada riwayat konsultasi."
        }));

      case 14:
        console.log("Consultations Data:", consultations);
        res.status(200).json({
          success: true,
          data: consultations
        });
        context$1$0.next = 22;
        break;

      case 18:
        context$1$0.prev = 18;
        context$1$0.t0 = context$1$0['catch'](3);

        console.error("Error saat mengambil riwayat konsultasi:", context$1$0.t0.message); // Debug log
        res.status(500).json({
          success: false,
          message: "Gagal mengambil riwayat konsultasi.",
          error: context$1$0.t0.message
        });

      case 22:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[3, 18]]);
};

exports.getConsultationHistory = getConsultationHistory;
var getConsultation = function getConsultation(req, res) {
  var id, consultation, userName, complaint, answer, answerImage, consultationTopic, fishExpert, fishExpertName, fishExpertSpecialization, fishTypeName, fishLength, fishAge, fishImage, fishWeight, chatEnabled, consultationStatus, createdAt;
  return regeneratorRuntime.async(function getConsultation$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        id = req.params.id;

        console.log('ID konsultasi:', id);

        context$1$0.prev = 2;
        context$1$0.next = 5;
        return regeneratorRuntime.awrap(_modelsConsultationModelJs2['default'].findOne({
          where: { consultation_id: id },
          attributes: ['created_at', 'chat_enabled', 'consultation_status'], // Ambil created_at langsung
          include: [{
            model: _modelsUserModelJs2['default'],
            attributes: ['user_id', 'name', 'email']
          }, {
            model: _modelsUserConsultationModelJs2['default'],
            attributes: ['user_consultation_id', 'complaint', 'consultation_topic', 'fish_type_id', 'fish_length', 'fish_weight', 'fish_age', 'fish_image'],
            include: [{
              model: _modelsFishTypeModelJs2['default'],
              attributes: ['name']
            }]
          }, {
            model: _modelsFishExpertsModelJs2['default'],
            attributes: ['fishExperts_id', 'name', 'specialization']
          }, {
            model: _modelsFishExpertAnswerModelJs2['default'],
            attributes: ['fish_expert_answer_id', 'answer', 'image']
          }]
        }));

      case 5:
        consultation = context$1$0.sent;

        console.log('Consultation data:', JSON.stringify(consultation, null, 2));

        if (consultation) {
          context$1$0.next = 9;
          break;
        }

        return context$1$0.abrupt('return', res.status(404).json({ error: 'Konsultasi tidak ditemukan' }));

      case 9:
        userName = consultation.User ? consultation.User.name : 'Tidak ada nama pengguna';
        complaint = consultation.UserConsultation ? consultation.UserConsultation.complaint : 'Tidak ada keluhan';
        answer = consultation.FishExpertAnswer ? consultation.FishExpertAnswer.answer : 'Belum ada jawaban dari ahli ikan';
        answerImage = consultation.FishExpertAnswer ? consultation.FishExpertAnswer.image : 'Tidak ada gambar jawaban';
        consultationTopic = consultation.UserConsultation ? consultation.UserConsultation.consultation_topic : 'Tidak ada topik konsultasi';
        fishExpert = consultation.FishExpert || {};
        fishExpertName = fishExpert.name || 'Tidak ada nama ahli ikan';
        fishExpertSpecialization = fishExpert.specialization || 'Tidak ada spesialisasi';
        fishTypeName = consultation.UserConsultation && consultation.UserConsultation.FishType ? consultation.UserConsultation.FishType.name : 'Tidak ada jenis ikan';
        fishLength = consultation.UserConsultation ? consultation.UserConsultation.fish_length : 'Tidak ada panjang ikan';
        fishAge = consultation.UserConsultation ? consultation.UserConsultation.fish_age : 'Tidak ada umur ikan';
        fishImage = consultation.UserConsultation ? consultation.UserConsultation.fish_image : '[]';
        fishWeight = consultation.UserConsultation ? consultation.UserConsultation.fish_weight : 'Tidak ada berat ikan';
        chatEnabled = consultation.chat_enabled;
        consultationStatus = consultation.consultation_status;
        createdAt = consultation.created_at;
        // Ambil tanggal konsultasi dibuat

        res.json({
          title: consultationTopic,
          description: complaint,
          answer: answer,
          name: userName,
          fish_expert_name: fishExpertName,
          fish_expert_specialization: fishExpertSpecialization,
          fish_type: fishTypeName,
          fish_length: fishLength,
          fish_weight: fishWeight,
          fish_age: fishAge,
          fish_image: fishImage,
          answer_image: answerImage,
          chat_enabled: chatEnabled,
          consultation_status: consultationStatus,
          created_at: createdAt });
        context$1$0.next = 32;
        break;

      case 28:
        context$1$0.prev = 28;
        context$1$0.t0 = context$1$0['catch'](2);

        console.error('Error:', context$1$0.t0.message, context$1$0.t0.stack);
        res.status(500).json({ error: 'Terjadi kesalahan pada server' });

      case 32:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[2, 28]]);
};

exports.getConsultation = getConsultation;
var enableChat = function enableChat(req, res) {
  var id, consultation;
  return regeneratorRuntime.async(function enableChat$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        id = req.params.id;
        context$1$0.prev = 1;
        context$1$0.next = 4;
        return regeneratorRuntime.awrap(_modelsConsultationModelJs2['default'].findByPk(id));

      case 4:
        consultation = context$1$0.sent;

        if (consultation) {
          context$1$0.next = 7;
          break;
        }

        return context$1$0.abrupt('return', res.status(404).json({ error: "Konsultasi tidak ditemukan" }));

      case 7:

        // Update chat_enabled menjadi true
        consultation.chat_enabled = true;
        context$1$0.next = 10;
        return regeneratorRuntime.awrap(consultation.save());

      case 10:

        res.json({ message: "Fitur chat telah diaktifkan." });
        context$1$0.next = 17;
        break;

      case 13:
        context$1$0.prev = 13;
        context$1$0.t0 = context$1$0['catch'](1);

        console.error("Error:", context$1$0.t0.message);
        res.status(500).json({ error: "Terjadi kesalahan pada server." });

      case 17:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[1, 13]]);
};

exports.enableChat = enableChat;
var endConsultation = function endConsultation(req, res) {
  var id, consultation;
  return regeneratorRuntime.async(function endConsultation$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        id = req.params.id;
        context$1$0.prev = 1;
        context$1$0.next = 4;
        return regeneratorRuntime.awrap(_modelsConsultationModelJs2['default'].findByPk(id));

      case 4:
        consultation = context$1$0.sent;

        if (consultation) {
          context$1$0.next = 7;
          break;
        }

        return context$1$0.abrupt('return', res.status(404).json({ error: "Konsultasi tidak ditemukan" }));

      case 7:

        // Update status konsultasi menjadi "Closed"
        consultation.consultation_status = "Closed";
        context$1$0.next = 10;
        return regeneratorRuntime.awrap(consultation.save());

      case 10:

        res.json({ message: "Konsultasi berhasil diakhiri" });
        context$1$0.next = 17;
        break;

      case 13:
        context$1$0.prev = 13;
        context$1$0.t0 = context$1$0['catch'](1);

        console.error("Error saat mengupdate status konsultasi:", context$1$0.t0.message);
        res.status(500).json({ error: "Terjadi kesalahan saat mengakhiri konsultasi" });

      case 17:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[1, 13]]);
};
exports.endConsultation = endConsultation;

// Ambil konsultasi berdasarkan ID dari parameter

// Jika data tidak ditemukan

// Berhasil mengambil data

// Decode token

// Tambahkan chat_enabled, consultation_status, dan created_at
// Kirim ke response

// Cek apakah konsultasi ada