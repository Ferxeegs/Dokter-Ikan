"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _controllersFishDiseaseControllerJs = require("../controllers/FishDiseaseController.js");

var router = _express2["default"].Router();

router.get("/fishdiseases", _controllersFishDiseaseControllerJs.getFishDiseases); // Get all diseases
router.post("/diagnose", _controllersFishDiseaseControllerJs.diagnoseFish);
router.post("/fishdiseases", _controllersFishDiseaseControllerJs.getFishDiseasesByNames); // Get fish diseases by names

exports["default"] = router;
module.exports = exports["default"];