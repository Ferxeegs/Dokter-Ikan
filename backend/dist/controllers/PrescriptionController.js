'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _modelsPrescriptionModelJs = require('../models/PrescriptionModel.js');

var _modelsPrescriptionModelJs2 = _interopRequireDefault(_modelsPrescriptionModelJs);

var _modelsConsultationModelJs = require('../models/ConsultationModel.js');

var _modelsConsultationModelJs2 = _interopRequireDefault(_modelsConsultationModelJs);

var _modelsFishExpertsModelJs = require('../models/FishExpertsModel.js');

var _modelsFishExpertsModelJs2 = _interopRequireDefault(_modelsFishExpertsModelJs);

var _modelsPrescriptionMedicineModelJs = require('../models/PrescriptionMedicineModel.js');

var _modelsPrescriptionMedicineModelJs2 = _interopRequireDefault(_modelsPrescriptionMedicineModelJs);

var _modelsMedicineModelJs = require('../models/MedicineModel.js');

var _modelsMedicineModelJs2 = _interopRequireDefault(_modelsMedicineModelJs);

require("regenerator-runtime/runtime");

// Fungsi untuk mendapatkan semua resep medis
var getAllPrescriptions = function getAllPrescriptions(req, res) {
  var prescriptions;
  return regeneratorRuntime.async(function getAllPrescriptions$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsPrescriptionModelJs2['default'].findAll({
          include: [{
            model: _modelsConsultationModelJs2['default'], // Include model Consultation
            attributes: ['consultation_id'] // Atribut yang ingin diambil
          }, {
            model: _modelsFishExpertsModelJs2['default'], // Include model FishExpert
            attributes: ['fishExperts_id', 'name'] // Atribut yang ingin diambil
          }]
        }));

      case 3:
        prescriptions = context$1$0.sent;

        // Jika data berhasil diambil
        res.status(200).json(prescriptions);
        context$1$0.next = 10;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0['catch'](0);

        // Jika terjadi error
        res.status(500).json({ message: 'Gagal mengambil data resep medis', error: context$1$0.t0.message });

      case 10:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[0, 7]]);
};

exports.getAllPrescriptions = getAllPrescriptions;
var createPrescription = function createPrescription(req, res) {
  var _req$body, consultation_id, fishExperts_id, instruction, newPrescription;

  return regeneratorRuntime.async(function createPrescription$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        _req$body = req.body;
        consultation_id = _req$body.consultation_id;
        fishExperts_id = _req$body.fishExperts_id;
        instruction = _req$body.instruction;

        if (!(!consultation_id || !fishExperts_id)) {
          context$1$0.next = 7;
          break;
        }

        return context$1$0.abrupt('return', res.status(400).json({ message: 'consultation_id dan fishExperts_id harus diisi' }));

      case 7:
        context$1$0.next = 9;
        return regeneratorRuntime.awrap(_modelsPrescriptionModelJs2['default'].create({
          consultation_id: consultation_id,
          fishExperts_id: fishExperts_id,
          instruction: instruction }));

      case 9:
        newPrescription = context$1$0.sent;
        // Simpan instruction di database

        res.status(201).json(newPrescription);
        context$1$0.next = 16;
        break;

      case 13:
        context$1$0.prev = 13;
        context$1$0.t0 = context$1$0['catch'](0);

        res.status(500).json({ message: 'Gagal menambahkan data resep medis', error: context$1$0.t0.message });

      case 16:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[0, 13]]);
};

exports.createPrescription = createPrescription;
var getPrescriptionsByConsultationId = function getPrescriptionsByConsultationId(req, res) {
  var consultation_id, prescription, prescriptionMedicines, medicines;
  return regeneratorRuntime.async(function getPrescriptionsByConsultationId$(context$1$0) {
    var _this2 = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        consultation_id = req.query.consultation_id;
        context$1$0.prev = 1;

        if (consultation_id) {
          context$1$0.next = 4;
          break;
        }

        return context$1$0.abrupt('return', res.status(400).json({ error: 'Consultation ID wajib diberikan' }));

      case 4:

        console.log('Mencari resep dengan consultation_id: ' + consultation_id);

        // Mencari resep berdasarkan consultation_id
        context$1$0.next = 7;
        return regeneratorRuntime.awrap(_modelsPrescriptionModelJs2['default'].findOne({
          where: { consultation_id: consultation_id },
          attributes: ['prescription_id', 'instruction'] }));

      case 7:
        prescription = context$1$0.sent;
        // Ambil prescription_id dan instruction

        console.log('Prescription found:', prescription); // Log prescription yang ditemukan

        if (prescription) {
          context$1$0.next = 11;
          break;
        }

        return context$1$0.abrupt('return', res.status(404).json({ message: 'Resep tidak ditemukan untuk konsultasi ini.' }));

      case 11:
        context$1$0.next = 13;
        return regeneratorRuntime.awrap(_modelsPrescriptionMedicineModelJs2['default'].findAll({
          where: { prescription_id: prescription.prescription_id }
        }));

      case 13:
        prescriptionMedicines = context$1$0.sent;

        console.log('Prescription Medicines found:', prescriptionMedicines); // Log prescriptionMedicines yang ditemukan

        // Menyiapkan data obat
        context$1$0.next = 17;
        return regeneratorRuntime.awrap(Promise.all(prescriptionMedicines.map(function callee$1$0(prescriptionMedicine) {
          var medicine;
          return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                context$2$0.next = 2;
                return regeneratorRuntime.awrap(_modelsMedicineModelJs2['default'].findOne({
                  where: { medicine_id: prescriptionMedicine.medicine_id }
                }));

              case 2:
                medicine = context$2$0.sent;

                console.log('Medicine found: ' + (medicine ? medicine.medicine_name : 'Tidak ditemukan')); // Log nama obat

                return context$2$0.abrupt('return', {
                  title: medicine ? medicine.medicine_name : 'Tidak ditemukan',
                  content: medicine ? medicine.contain : '',
                  dose: medicine ? medicine.dosage : '',
                  image: medicine ? medicine.medicine_image : '',
                  price: medicine ? medicine.price : ''
                });

              case 5:
              case 'end':
                return context$2$0.stop();
            }
          }, null, _this2);
        })));

      case 17:
        medicines = context$1$0.sent;

        console.log('Medicines prepared:', medicines); // Log obat yang telah dipersiapkan

        // Mengirimkan data resep dan obat yang terkait
        res.status(200).json({
          prescription_id: prescription.prescription_id,
          instruction: prescription.instruction, // Tambahkan instruction ke dalam respons
          medicines: medicines
        });
        context$1$0.next = 26;
        break;

      case 22:
        context$1$0.prev = 22;
        context$1$0.t0 = context$1$0['catch'](1);

        console.error('Error occurred:', context$1$0.t0); // Log error yang terjadi
        res.status(500).json({ error: 'Gagal mengambil data resep dan obat', details: context$1$0.t0.message });

      case 26:
      case 'end':
        return context$1$0.stop();
    }
  }, null, _this, [[1, 22]]);
};
exports.getPrescriptionsByConsultationId = getPrescriptionsByConsultationId;
// Tambahkan instruction

// Mencari semua medicine_id yang terkait dengan prescription_id