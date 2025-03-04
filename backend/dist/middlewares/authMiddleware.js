'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var authenticate = function authenticate(req, res, next) {
  var authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  var token = authHeader.split(' ')[1];

  try {
    var decoded = _jsonwebtoken2['default'].verify(token, process.env.JWT_SECRET); // Verifikasi token
    console.log('Decoded Token:', decoded); // Log token yang didecode
    req.user = decoded; // Menyimpan informasi token ke req.user
    next(); // Lanjutkan ke route berikutnya
  } catch (error) {
    console.error('Token verification error:', error); // Log jika token tidak valid
    return res.status(403).json({ message: 'Token tidak valid', error: error.message });
  }
};
exports.authenticate = authenticate;