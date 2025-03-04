"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _controllersSymptomControllerJs = require("../controllers/SymptomController.js");

var router = _express2["default"].Router();

router.get("/symptoms", _controllersSymptomControllerJs.getSymptoms); // Get all symptoms
router.get("/symptoms/:id", _controllersSymptomControllerJs.getSymptomById); // Get symptom by ID

exports["default"] = router;
module.exports = exports["default"];