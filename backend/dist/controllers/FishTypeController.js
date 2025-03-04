"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _modelsFishTypeModelJs = require("../models/FishTypeModel.js");

var _modelsFishTypeModelJs2 = _interopRequireDefault(_modelsFishTypeModelJs);

// Import model FishType

require("regenerator-runtime/runtime");

// Fungsi untuk mendapatkan semua Fish Types
var getAllFishTypes = function getAllFishTypes(req, res) {
  var fishTypes;
  return regeneratorRuntime.async(function getAllFishTypes$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsFishTypeModelJs2["default"].findAll());

      case 3:
        fishTypes = context$1$0.sent;

        res.status(200).json(fishTypes);
        context$1$0.next = 10;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: "Gagal mengambil data jenis ikan", error: context$1$0.t0 });

      case 10:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 7]]);
};

exports.getAllFishTypes = getAllFishTypes;
// Fungsi untuk mendapatkan Fish Type berdasarkan ID
var getFishTypeById = function getFishTypeById(req, res) {
  var fishType;
  return regeneratorRuntime.async(function getFishTypeById$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsFishTypeModelJs2["default"].findByPk(req.params.id));

      case 3:
        fishType = context$1$0.sent;

        if (fishType) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: "Jenis ikan tidak ditemukan" }));

      case 6:
        res.status(200).json(fishType);
        context$1$0.next = 12;
        break;

      case 9:
        context$1$0.prev = 9;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: "Gagal mengambil data jenis ikan", error: context$1$0.t0 });

      case 12:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 9]]);
};

exports.getFishTypeById = getFishTypeById;
// Fungsi untuk mendapatkan Fish Type berdasarkan nama ikan
var getFishTypeByName = function getFishTypeByName(req, res) {
  var _name, fishType;

  return regeneratorRuntime.async(function getFishTypeByName$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        _name = req.query.name;

        if (_name) {
          context$1$0.next = 4;
          break;
        }

        return context$1$0.abrupt("return", res.status(400).json({ message: "Nama ikan diperlukan" }));

      case 4:
        context$1$0.next = 6;
        return regeneratorRuntime.awrap(_modelsFishTypeModelJs2["default"].findOne({
          where: { name: _name }
        }));

      case 6:
        fishType = context$1$0.sent;

        if (fishType) {
          context$1$0.next = 9;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: "Jenis ikan tidak ditemukan" }));

      case 9:

        res.status(200).json(fishType);
        context$1$0.next = 15;
        break;

      case 12:
        context$1$0.prev = 12;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: "Gagal mengambil data jenis ikan", error: context$1$0.t0 });

      case 15:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 12]]);
};
exports.getFishTypeByName = getFishTypeByName;