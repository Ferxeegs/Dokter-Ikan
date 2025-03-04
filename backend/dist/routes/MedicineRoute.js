"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _controllersMedicineControllerJs = require("../controllers/MedicineController.js");

var router = _express2["default"].Router();

// Definisi route
router.get('/medicines', _controllersMedicineControllerJs.getAllMedicines); // Mendapatkan semua data obat
router.get('/medicines/:id', _controllersMedicineControllerJs.getMedicineById); // Mendapatkan data obat berdasarkan ID
router.post('/medicines', _controllersMedicineControllerJs.createMedicine); // Menambahkan obat baru
router.put('/medicines/:id', _controllersMedicineControllerJs.updateMedicine); // Memperbarui data obat berdasarkan ID

exports["default"] = router;
module.exports = exports["default"];