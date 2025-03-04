'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsPrescriptionMedicineModelJs = require('../models/PrescriptionMedicineModel.js');

var _modelsPrescriptionMedicineModelJs2 = _interopRequireDefault(_modelsPrescriptionMedicineModelJs);

require("regenerator-runtime/runtime");

var getAllPrescriptionMedicines = function getAllPrescriptionMedicines(req, res) {
  var prescriptionMedicines;
  return regeneratorRuntime.async(function getAllPrescriptionMedicines$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsPrescriptionMedicineModelJs2['default'].findAll());

      case 3:
        prescriptionMedicines = context$1$0.sent;

        res.status(200).json(prescriptionMedicines);
        context$1$0.next = 10;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0['catch'](0);

        res.status(500).json({ message: 'Gagal mengambil data prescriptions_medicine', error: context$1$0.t0.message });

      case 10:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[0, 7]]);
};

exports.getAllPrescriptionMedicines = getAllPrescriptionMedicines;
var createPrescriptionMedicine = function createPrescriptionMedicine(req, res) {
  var _req$body, prescription_id, medicine_id, newPrescriptionMedicine;

  return regeneratorRuntime.async(function createPrescriptionMedicine$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        _req$body = req.body;
        prescription_id = _req$body.prescription_id;
        medicine_id = _req$body.medicine_id;

        if (!(!prescription_id || !medicine_id)) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt('return', res.status(400).json({ message: 'prescription_id dan medicine_id harus diisi' }));

      case 6:
        context$1$0.next = 8;
        return regeneratorRuntime.awrap(_modelsPrescriptionMedicineModelJs2['default'].create({
          prescription_id: prescription_id,
          medicine_id: medicine_id
        }));

      case 8:
        newPrescriptionMedicine = context$1$0.sent;

        res.status(201).json(newPrescriptionMedicine);
        context$1$0.next = 15;
        break;

      case 12:
        context$1$0.prev = 12;
        context$1$0.t0 = context$1$0['catch'](0);

        res.status(500).json({ message: 'Gagal menambahkan data resep obat', error: context$1$0.t0.message });

      case 15:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[0, 12]]);
};
exports.createPrescriptionMedicine = createPrescriptionMedicine;