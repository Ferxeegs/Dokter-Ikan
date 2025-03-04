"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _controllersUserControllerJs = require("../controllers/UserController.js");

var _middlewaresAuthMiddlewareJs = require("../middlewares/authMiddleware.js");

// Impor middleware authenticate

var router = _express2["default"].Router();

// Rute yang tidak memerlukan autentikasi
router.post('/register', _controllersUserControllerJs.createUser); // Mendaftar pengguna baru
router.post('/login', _controllersUserControllerJs.loginUser); // Login pengguna

// Rute yang memerlukan autentikasi
router.get('/users', _middlewaresAuthMiddlewareJs.authenticate, _controllersUserControllerJs.getAllUsers); // Mendapatkan semua pengguna (diperlukan autentikasi)
router.get('/users/:id', _middlewaresAuthMiddlewareJs.authenticate, _controllersUserControllerJs.getUserById); // Mendapatkan pengguna berdasarkan ID (diperlukan autentikasi)
router.put('/users/:id', _middlewaresAuthMiddlewareJs.authenticate, _controllersUserControllerJs.updateUser); // Memperbarui pengguna berdasarkan ID (diperlukan autentikasi)
router.get('/me', _middlewaresAuthMiddlewareJs.authenticate, _controllersUserControllerJs.getMe);
router.put('/update-password', _middlewaresAuthMiddlewareJs.authenticate, _controllersUserControllerJs.updatePassword);
router.put('/update-profile', _middlewaresAuthMiddlewareJs.authenticate, _controllersUserControllerJs.updateProfile);

exports["default"] = router;
module.exports = exports["default"];