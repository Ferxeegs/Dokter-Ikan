"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _modelsFishExpertAnswerModelJs = require("../models/FishExpertAnswerModel.js");

var _modelsFishExpertAnswerModelJs2 = _interopRequireDefault(_modelsFishExpertAnswerModelJs);

require("regenerator-runtime/runtime");

// Fungsi untuk mendapatkan semua jawaban dari ahli ikan
var getAllFishExpertAnswers = function getAllFishExpertAnswers(req, res) {
  var answers;
  return regeneratorRuntime.async(function getAllFishExpertAnswers$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsFishExpertAnswerModelJs2["default"].findAll());

      case 3:
        answers = context$1$0.sent;

        res.status(200).json(answers);
        context$1$0.next = 10;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: 'Gagal mengambil data jawaban ahli ikan', error: context$1$0.t0 });

      case 10:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 7]]);
};

exports.getAllFishExpertAnswers = getAllFishExpertAnswers;
// Fungsi untuk mendapatkan jawaban berdasarkan ID
var getFishExpertAnswerById = function getFishExpertAnswerById(req, res) {
  var answer;
  return regeneratorRuntime.async(function getFishExpertAnswerById$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsFishExpertAnswerModelJs2["default"].findByPk(req.params.id));

      case 3:
        answer = context$1$0.sent;

        if (answer) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: 'Jawaban tidak ditemukan' }));

      case 6:
        res.status(200).json(answer);
        context$1$0.next = 12;
        break;

      case 9:
        context$1$0.prev = 9;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: 'Gagal mengambil data jawaban ahli ikan', error: context$1$0.t0 });

      case 12:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 9]]);
};

exports.getFishExpertAnswerById = getFishExpertAnswerById;
// Fungsi untuk menambahkan jawaban baru
var createFishExpertAnswer = function createFishExpertAnswer(req, res) {
  var _req$body, fishExpert_id, answer, timestamp, image, newAnswer;

  return regeneratorRuntime.async(function createFishExpertAnswer$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        _req$body = req.body;
        fishExpert_id = _req$body.fishExpert_id;
        answer = _req$body.answer;
        timestamp = _req$body.timestamp;
        image = _req$body.image;

        if (!(!fishExpert_id || !answer || !timestamp)) {
          context$1$0.next = 8;
          break;
        }

        return context$1$0.abrupt("return", res.status(400).json({ message: 'Data tidak lengkap' }));

      case 8:
        context$1$0.next = 10;
        return regeneratorRuntime.awrap(_modelsFishExpertAnswerModelJs2["default"].create({
          fishExpert_id: fishExpert_id,
          answer: answer,
          timestamp: timestamp,
          image: image || null }));

      case 10:
        newAnswer = context$1$0.sent;
        // Jika tidak ada image, disimpan sebagai NULL

        res.status(201).json({ message: 'Jawaban berhasil dibuat', newAnswer: newAnswer });
        context$1$0.next = 18;
        break;

      case 14:
        context$1$0.prev = 14;
        context$1$0.t0 = context$1$0["catch"](0);

        console.error('Error backend:', context$1$0.t0);
        res.status(500).json({ message: 'Terjadi kesalahan pada server', error: context$1$0.t0 });

      case 18:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 14]]);
};

exports.createFishExpertAnswer = createFishExpertAnswer;
// Fungsi untuk memperbarui jawaban berdasarkan ID
var updateFishExpertAnswer = function updateFishExpertAnswer(req, res) {
  var answer, _req$body2, updatedAnswer, timestamp, consultation_status;

  return regeneratorRuntime.async(function updateFishExpertAnswer$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsFishExpertAnswerModelJs2["default"].findByPk(req.params.id));

      case 3:
        answer = context$1$0.sent;

        if (answer) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: 'Jawaban tidak ditemukan' }));

      case 6:
        _req$body2 = req.body;
        updatedAnswer = _req$body2.answer;
        timestamp = _req$body2.timestamp;
        consultation_status = _req$body2.consultation_status;
        context$1$0.next = 12;
        return regeneratorRuntime.awrap(answer.update({ answer: updatedAnswer, timestamp: timestamp, consultation_status: consultation_status }));

      case 12:

        res.status(200).json({ message: 'Jawaban berhasil diperbarui', answer: answer });
        context$1$0.next = 18;
        break;

      case 15:
        context$1$0.prev = 15;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: 'Gagal memperbarui jawaban', error: context$1$0.t0 });

      case 18:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 15]]);
};

exports.updateFishExpertAnswer = updateFishExpertAnswer;
// Fungsi untuk menghapus jawaban berdasarkan ID
var deleteFishExpertAnswer = function deleteFishExpertAnswer(req, res) {
  var answer;
  return regeneratorRuntime.async(function deleteFishExpertAnswer$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsFishExpertAnswerModelJs2["default"].findByPk(req.params.id));

      case 3:
        answer = context$1$0.sent;

        if (answer) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: 'Jawaban tidak ditemukan' }));

      case 6:
        context$1$0.next = 8;
        return regeneratorRuntime.awrap(answer.destroy());

      case 8:
        res.status(200).json({ message: 'Jawaban berhasil dihapus' });
        context$1$0.next = 14;
        break;

      case 11:
        context$1$0.prev = 11;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: 'Gagal menghapus jawaban', error: context$1$0.t0 });

      case 14:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 11]]);
};
exports.deleteFishExpertAnswer = deleteFishExpertAnswer;
// Menambahkan image ke dalam request body

// Validasi input (image opsional, tidak wajib)

// Menyimpan jawaban ke database