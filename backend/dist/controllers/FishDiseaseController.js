"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _modelsFishDiseaseModelJs = require("../models/FishDiseaseModel.js");

var _modelsFishDiseaseModelJs2 = _interopRequireDefault(_modelsFishDiseaseModelJs);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

require("regenerator-runtime/runtime");

// Get all fish diseases
var getFishDiseases = function getFishDiseases(req, res) {
  var diseases;
  return regeneratorRuntime.async(function getFishDiseases$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsFishDiseaseModelJs2["default"].findAll());

      case 3:
        diseases = context$1$0.sent;

        res.status(200).json({ success: true, data: diseases });
        context$1$0.next = 10;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ success: false, message: context$1$0.t0.message });

      case 10:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 7]]);
};

exports.getFishDiseases = getFishDiseases;
// Diagnose fish disease by sending symptoms to Flask API
var diagnoseFish = function diagnoseFish(req, res) {
  var symptoms, response;
  return regeneratorRuntime.async(function diagnoseFish$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        symptoms = req.body.symptoms;

        if (!(!symptoms || !Array.isArray(symptoms) || symptoms.length === 0)) {
          context$1$0.next = 4;
          break;
        }

        return context$1$0.abrupt("return", res.status(400).json({ success: false, message: "Gejala tidak boleh kosong" }));

      case 4:
        context$1$0.next = 6;
        return regeneratorRuntime.awrap(_axios2["default"].post("http://localhost:5000/diagnose", {
          symptoms: symptoms }));

      case 6:
        response = context$1$0.sent;
        return context$1$0.abrupt("return", res.status(200).json({ success: true, data: response.data }));

      case 10:
        context$1$0.prev = 10;
        context$1$0.t0 = context$1$0["catch"](0);

        console.error("Error saat menghubungi expert system:", context$1$0.t0.message);
        return context$1$0.abrupt("return", res.status(500).json({
          success: false,
          message: "Gagal menghubungi sistem pakar"
        }));

      case 14:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 10]]);
};

exports.diagnoseFish = diagnoseFish;
var getFishDiseasesByNames = function getFishDiseasesByNames(req, res) {
  var diseases, fishDiseases;
  return regeneratorRuntime.async(function getFishDiseasesByNames$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        diseases = req.body.diseases;

        if (!(!diseases || !Array.isArray(diseases) || diseases.length === 0)) {
          context$1$0.next = 4;
          break;
        }

        return context$1$0.abrupt("return", res.status(400).json({ success: false, message: "Daftar penyakit tidak boleh kosong" }));

      case 4:
        context$1$0.next = 6;
        return regeneratorRuntime.awrap(_modelsFishDiseaseModelJs2["default"].findAll({
          where: {
            name: diseases
          }
        }));

      case 6:
        fishDiseases = context$1$0.sent;

        res.status(200).json({ success: true, data: fishDiseases });
        context$1$0.next = 13;
        break;

      case 10:
        context$1$0.prev = 10;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ success: false, message: context$1$0.t0.message });

      case 13:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 10]]);
};
exports.getFishDiseasesByNames = getFishDiseasesByNames;

// Kirim data ke Flask API di port 5000
// Kirim daftar kode gejala