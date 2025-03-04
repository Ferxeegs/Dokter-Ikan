"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _modelsSymptomModelJs = require("../models/SymptomModel.js");

var _modelsSymptomModelJs2 = _interopRequireDefault(_modelsSymptomModelJs);

require("regenerator-runtime/runtime");

// Get all symptoms
var getSymptoms = function getSymptoms(req, res) {
  var symptoms;
  return regeneratorRuntime.async(function getSymptoms$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsSymptomModelJs2["default"].findAll());

      case 3:
        symptoms = context$1$0.sent;

        res.status(200).json({ success: true, data: symptoms });
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

exports.getSymptoms = getSymptoms;
// Get symptom by ID
var getSymptomById = function getSymptomById(req, res) {
  var symptom;
  return regeneratorRuntime.async(function getSymptomById$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsSymptomModelJs2["default"].findByPk(req.params.id));

      case 3:
        symptom = context$1$0.sent;

        if (symptom) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ success: false, message: "Symptom not found" }));

      case 6:
        res.status(200).json({ success: true, data: symptom });
        context$1$0.next = 12;
        break;

      case 9:
        context$1$0.prev = 9;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ success: false, message: context$1$0.t0.message });

      case 12:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 9]]);
};
exports.getSymptomById = getSymptomById;