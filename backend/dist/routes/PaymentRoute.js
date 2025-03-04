'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _controllersPaymentControllerJs = require('../controllers/PaymentController.js');

var router = _express2['default'].Router();

router.get('/payments', _controllersPaymentControllerJs.getAllPayments); // Ambil semua pembayaran
router.get('/payments/:id', _controllersPaymentControllerJs.getPaymentById); // Ambil pembayaran berdasarkan ID
router.post('/payments', _controllersPaymentControllerJs.createPayment); // Tambah pembayaran baru
router.put('/payments/:id', _controllersPaymentControllerJs.updatePayment); // Update status pembayaran
router['delete']('/payments/:id', _controllersPaymentControllerJs.deletePayment); // Hapus pembayaran
router.get("/paymentsbyconsultation", _controllersPaymentControllerJs.getPaymentByConsultationId);

exports['default'] = router;
module.exports = exports['default'];