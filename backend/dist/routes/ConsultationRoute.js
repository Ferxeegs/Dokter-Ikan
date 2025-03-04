'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _controllersConsultationControllerJs = require('../controllers/ConsultationController.js');

var _middlewaresAuthMiddlewareJs = require("../middlewares/authMiddleware.js");

var router = _express2['default'].Router();

// Definisi route untuk mendapatkan semua konsultasi
router.get('/consultations', _controllersConsultationControllerJs.getAllConsultations);
router.get('/consultations/:id', _controllersConsultationControllerJs.getConsultation);
router.get('/consultation', _middlewaresAuthMiddlewareJs.authenticate, _controllersConsultationControllerJs.getConsultationHistory);
router.post('/consultations', _middlewaresAuthMiddlewareJs.authenticate, _controllersConsultationControllerJs.createConsultation);
router.put('/consultations/:id', _middlewaresAuthMiddlewareJs.authenticate, _controllersConsultationControllerJs.updateConsultation);
router.patch("/consultations/:id/enable-chat", _middlewaresAuthMiddlewareJs.authenticate, _controllersConsultationControllerJs.enableChat);
router.patch("/consultations/:id/end", _middlewaresAuthMiddlewareJs.authenticate, _controllersConsultationControllerJs.endConsultation);

exports['default'] = router;
module.exports = exports['default'];