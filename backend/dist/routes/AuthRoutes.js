'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _controllersAuthControllerJs = require('../controllers/AuthController.js');

var router = _express2['default'].Router();

router.post('/start-registration', _controllersAuthControllerJs.startRegistration); // Route untuk memulai registrasi
router.post('/verify-otp', _controllersAuthControllerJs.verifyOtp); // Route untuk verifikasi OTP
router.post('/complete-registration', _controllersAuthControllerJs.completeRegistration); // Route untuk melengkapi pendaftaran
router.post('/forgot-password', _controllersAuthControllerJs.forgotPassword);
router.post('/reset-password', _controllersAuthControllerJs.resetPassword);

exports['default'] = router;
module.exports = exports['default'];