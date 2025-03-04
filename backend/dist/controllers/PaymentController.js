'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsPaymentModelJs = require('../models/PaymentModel.js');

var _modelsPaymentModelJs2 = _interopRequireDefault(_modelsPaymentModelJs);

var _modelsPrescriptionModelJs = require('../models/PrescriptionModel.js');

var _modelsPrescriptionModelJs2 = _interopRequireDefault(_modelsPrescriptionModelJs);

var _modelsConsultationModelJs = require('../models/ConsultationModel.js');

var _modelsConsultationModelJs2 = _interopRequireDefault(_modelsConsultationModelJs);

// Relasi ke Consultation

require("regenerator-runtime/runtime");

// Mendapatkan semua pembayaran
var getAllPayments = function getAllPayments(req, res) {
  var payments;
  return regeneratorRuntime.async(function getAllPayments$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsPaymentModelJs2['default'].findAll({
          include: [{
            model: _modelsConsultationModelJs2['default'],
            attributes: ['consultation_id', 'user_id', 'fishExpert_id']
          }, {
            model: _modelsPrescriptionModelJs2['default'],
            attributes: ['prescription_id', 'instruction']
          }]
        }));

      case 3:
        payments = context$1$0.sent;

        res.status(200).json(payments);
        context$1$0.next = 10;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0['catch'](0);

        res.status(500).json({ message: 'Gagal mengambil data pembayaran', error: context$1$0.t0.message });

      case 10:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[0, 7]]);
};

exports.getAllPayments = getAllPayments;
// Mendapatkan pembayaran berdasarkan ID
var getPaymentById = function getPaymentById(req, res) {
  var payment;
  return regeneratorRuntime.async(function getPaymentById$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsPaymentModelJs2['default'].findByPk(req.params.id, {
          include: [{
            model: _modelsConsultationModelJs2['default'],
            attributes: ['consultation_id', 'user_id', 'fishExpert_id']
          }, {
            model: _modelsPrescriptionModelJs2['default'],
            attributes: ['prescription_id', 'instruction']
          }]
        }));

      case 3:
        payment = context$1$0.sent;

        if (payment) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt('return', res.status(404).json({ message: 'Data pembayaran tidak ditemukan' }));

      case 6:

        res.status(200).json(payment);
        context$1$0.next = 12;
        break;

      case 9:
        context$1$0.prev = 9;
        context$1$0.t0 = context$1$0['catch'](0);

        res.status(500).json({ message: 'Gagal mengambil data pembayaran', error: context$1$0.t0.message });

      case 12:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[0, 9]]);
};

exports.getPaymentById = getPaymentById;
// Menambahkan pembayaran baru
var createPayment = function createPayment(req, res) {
  var _req$body, consultation_id, prescription_id, total_fee, payment_status, newPayment;

  return regeneratorRuntime.async(function createPayment$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        _req$body = req.body;
        consultation_id = _req$body.consultation_id;
        prescription_id = _req$body.prescription_id;
        total_fee = _req$body.total_fee;
        payment_status = _req$body.payment_status;

        if (!(!consultation_id || !total_fee)) {
          context$1$0.next = 8;
          break;
        }

        return context$1$0.abrupt('return', res.status(400).json({ message: 'Harap isi semua data yang diperlukan' }));

      case 8:
        context$1$0.next = 10;
        return regeneratorRuntime.awrap(_modelsPaymentModelJs2['default'].create({
          consultation_id: consultation_id,
          prescription_id: prescription_id || null, // Izinkan prescription_id menjadi null
          total_fee: total_fee,
          payment_status: payment_status || 'pending' // Default pending jika tidak diisi
        }));

      case 10:
        newPayment = context$1$0.sent;

        res.status(201).json({ message: 'Pembayaran berhasil ditambahkan', data: newPayment });
        context$1$0.next = 17;
        break;

      case 14:
        context$1$0.prev = 14;
        context$1$0.t0 = context$1$0['catch'](0);

        res.status(500).json({ message: 'Gagal menambahkan pembayaran', error: context$1$0.t0.message });

      case 17:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[0, 14]]);
};

exports.createPayment = createPayment;
// Memperbarui pembayaran
var updatePayment = function updatePayment(req, res) {
  var id, _req$body2, payment_method, payment_proof, payment;

  return regeneratorRuntime.async(function updatePayment$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        id = req.params.id;
        _req$body2 = req.body;
        payment_method = _req$body2.payment_method;
        payment_proof = _req$body2.payment_proof;
        context$1$0.next = 7;
        return regeneratorRuntime.awrap(_modelsPaymentModelJs2['default'].findByPk(id));

      case 7:
        payment = context$1$0.sent;

        if (payment) {
          context$1$0.next = 10;
          break;
        }

        return context$1$0.abrupt('return', res.status(404).json({ message: 'Payment not found' }));

      case 10:

        payment.payment_method = payment_method;
        payment.payment_proof = payment_proof;
        context$1$0.next = 14;
        return regeneratorRuntime.awrap(payment.save());

      case 14:

        res.status(200).json({ message: 'Payment updated successfully', payment: payment });
        context$1$0.next = 21;
        break;

      case 17:
        context$1$0.prev = 17;
        context$1$0.t0 = context$1$0['catch'](0);

        console.error('Error updating payment:', context$1$0.t0); // Tambahkan log error
        res.status(500).json({ message: 'Error updating payment', error: context$1$0.t0 });

      case 21:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[0, 17]]);
};

exports.updatePayment = updatePayment;
var getPaymentByConsultationId = function getPaymentByConsultationId(req, res) {
  var consultation_id, payment;
  return regeneratorRuntime.async(function getPaymentByConsultationId$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        consultation_id = req.query.consultation_id;

        if (consultation_id) {
          context$1$0.next = 4;
          break;
        }

        return context$1$0.abrupt('return', res.status(400).json({ error: "consultation_id is required" }));

      case 4:
        context$1$0.next = 6;
        return regeneratorRuntime.awrap(_modelsPaymentModelJs2['default'].findOne({
          where: { consultation_id: consultation_id },
          attributes: ["payment_id"] }));

      case 6:
        payment = context$1$0.sent;

        if (payment) {
          context$1$0.next = 9;
          break;
        }

        return context$1$0.abrupt('return', res.status(404).json({ error: "Payment not found for this consultation" }));

      case 9:

        res.json({ payment_id: payment.payment_id });
        context$1$0.next = 16;
        break;

      case 12:
        context$1$0.prev = 12;
        context$1$0.t0 = context$1$0['catch'](0);

        console.error("Error fetching payment:", context$1$0.t0);
        res.status(500).json({ error: "Internal Server Error" });

      case 16:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[0, 12]]);
};

exports.getPaymentByConsultationId = getPaymentByConsultationId;
// Menghapus pembayaran berdasarkan ID
var deletePayment = function deletePayment(req, res) {
  var payment;
  return regeneratorRuntime.async(function deletePayment$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsPaymentModelJs2['default'].findByPk(req.params.id));

      case 3:
        payment = context$1$0.sent;

        if (payment) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt('return', res.status(404).json({ message: 'Data pembayaran tidak ditemukan' }));

      case 6:
        context$1$0.next = 8;
        return regeneratorRuntime.awrap(payment.destroy());

      case 8:
        res.status(200).json({ message: 'Data pembayaran berhasil dihapus' });
        context$1$0.next = 14;
        break;

      case 11:
        context$1$0.prev = 11;
        context$1$0.t0 = context$1$0['catch'](0);

        res.status(500).json({ message: 'Gagal menghapus data pembayaran', error: context$1$0.t0.message });

      case 14:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[0, 11]]);
};
exports.deletePayment = deletePayment;

// Validasi input

// Cari pembayaran berdasarkan consultation_id
// Hanya ambil payment_id