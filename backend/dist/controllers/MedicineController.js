"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _modelsMedicineModelJs = require("../models/MedicineModel.js");

var _modelsMedicineModelJs2 = _interopRequireDefault(_modelsMedicineModelJs);

require("regenerator-runtime/runtime");

// Fungsi untuk mendapatkan semua data obat
var getAllMedicines = function getAllMedicines(req, res) {
  var medicines;
  return regeneratorRuntime.async(function getAllMedicines$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsMedicineModelJs2["default"].findAll());

      case 3:
        medicines = context$1$0.sent;

        res.status(200).json(medicines);
        context$1$0.next = 10;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: 'Gagal mengambil data obat', error: context$1$0.t0 });

      case 10:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 7]]);
};

exports.getAllMedicines = getAllMedicines;
// Fungsi untuk mendapatkan data obat berdasarkan ID
var getMedicineById = function getMedicineById(req, res) {
  var medicine;
  return regeneratorRuntime.async(function getMedicineById$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsMedicineModelJs2["default"].findByPk(req.params.id));

      case 3:
        medicine = context$1$0.sent;

        if (medicine) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: 'Obat tidak ditemukan' }));

      case 6:
        res.status(200).json(medicine);
        context$1$0.next = 12;
        break;

      case 9:
        context$1$0.prev = 9;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: 'Gagal mengambil data obat', error: context$1$0.t0 });

      case 12:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 9]]);
};

exports.getMedicineById = getMedicineById;
// Fungsi untuk menambahkan obat baru
var createMedicine = function createMedicine(req, res) {
  var _req$body, vendor_id, medicine_name, contain, dosage, price, medicine_image, newMedicine;

  return regeneratorRuntime.async(function createMedicine$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        _req$body = req.body;
        vendor_id = _req$body.vendor_id;
        medicine_name = _req$body.medicine_name;
        contain = _req$body.contain;
        dosage = _req$body.dosage;
        price = _req$body.price;
        medicine_image = _req$body.medicine_image;

        if (!(price < 0)) {
          context$1$0.next = 10;
          break;
        }

        return context$1$0.abrupt("return", res.status(400).json({ message: 'Harga tidak boleh negatif' }));

      case 10:
        context$1$0.next = 12;
        return regeneratorRuntime.awrap(_modelsMedicineModelJs2["default"].create({
          vendor_id: vendor_id,
          medicine_name: medicine_name,
          contain: contain,
          dosage: dosage,
          price: price,
          medicine_image: medicine_image
        }));

      case 12:
        newMedicine = context$1$0.sent;

        // Mengirim respons jika berhasil
        res.status(201).json({
          message: 'Obat berhasil ditambahkan',
          data: newMedicine
        });
        context$1$0.next = 19;
        break;

      case 16:
        context$1$0.prev = 16;
        context$1$0.t0 = context$1$0["catch"](0);

        // Mengirim respons jika terjadi error
        res.status(500).json({
          message: 'Gagal menambahkan obat',
          error: context$1$0.t0.message
        });

      case 19:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 16]]);
};

exports.createMedicine = createMedicine;
// Fungsi untuk memperbarui data obat
var updateMedicine = function updateMedicine(req, res) {
  var medicine, _req$body2, vendor_id, medicine_name, contain, dosage, price, medicine_image;

  return regeneratorRuntime.async(function updateMedicine$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsMedicineModelJs2["default"].findByPk(req.params.id));

      case 3:
        medicine = context$1$0.sent;

        if (medicine) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: 'Obat tidak ditemukan' }));

      case 6:
        _req$body2 = req.body;
        vendor_id = _req$body2.vendor_id;
        medicine_name = _req$body2.medicine_name;
        contain = _req$body2.contain;
        dosage = _req$body2.dosage;
        price = _req$body2.price;
        medicine_image = _req$body2.medicine_image;

        if (!(price < 0)) {
          context$1$0.next = 15;
          break;
        }

        return context$1$0.abrupt("return", res.status(400).json({ message: 'Harga tidak boleh negatif' }));

      case 15:
        context$1$0.next = 17;
        return regeneratorRuntime.awrap(medicine.update({
          vendor_id: vendor_id,
          medicine_name: medicine_name,
          contain: contain,
          dosage: dosage,
          price: price,
          medicine_image: medicine_image
        }));

      case 17:

        res.status(200).json({
          message: 'Obat berhasil diperbarui',
          data: medicine
        });
        context$1$0.next = 23;
        break;

      case 20:
        context$1$0.prev = 20;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: 'Gagal memperbarui obat', error: context$1$0.t0 });

      case 23:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 20]]);
};

exports.updateMedicine = updateMedicine;
// Fungsi untuk menghapus data obat
var deleteMedicine = function deleteMedicine(req, res) {
  var medicine;
  return regeneratorRuntime.async(function deleteMedicine$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsMedicineModelJs2["default"].findByPk(req.params.id));

      case 3:
        medicine = context$1$0.sent;

        if (medicine) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: 'Obat tidak ditemukan' }));

      case 6:
        context$1$0.next = 8;
        return regeneratorRuntime.awrap(medicine.destroy());

      case 8:
        res.status(200).json({ message: 'Obat berhasil dihapus' });
        context$1$0.next = 14;
        break;

      case 11:
        context$1$0.prev = 11;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: 'Gagal menghapus obat', error: context$1$0.t0 });

      case 14:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 11]]);
};
exports.deleteMedicine = deleteMedicine;

// Validasi harga harus angka positif

// Membuat data baru di tabel Medicine

// Validasi harga tidak boleh negatif