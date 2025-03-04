"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _controllersFishExpertControllerJs = require("../controllers/FishExpertController.js");

// Import controller FishExpert

var _middlewaresAuthMiddlewareJs = require("../middlewares/authMiddleware.js");

var router = _express2["default"].Router();

// Definisi route
router.get('/fishexperts', _controllersFishExpertControllerJs.getAllFishExperts); // Route untuk mendapatkan semua Fish Expert
router.get('/fishexperts/:id', _controllersFishExpertControllerJs.getFishExpertById); // Route untuk mendapatkan Fish Expert berdasarkan ID
router.post('/fishexperts', _controllersFishExpertControllerJs.createFishExpert);
router.put('/update-expert-password', _middlewaresAuthMiddlewareJs.authenticate, _controllersFishExpertControllerJs.updateFishExpertPassword); // Route untuk menambahkan Fish Expert baru

exports["default"] = router;
module.exports = exports["default"];