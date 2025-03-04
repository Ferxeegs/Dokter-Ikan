"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _modelsVendorModelJs = require("../models/VendorModel.js");

var _modelsVendorModelJs2 = _interopRequireDefault(_modelsVendorModelJs);

require("regenerator-runtime/runtime");

// Fungsi untuk mendapatkan semua vendor
var getAllVendors = function getAllVendors(req, res) {
  var vendors;
  return regeneratorRuntime.async(function getAllVendors$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsVendorModelJs2["default"].findAll());

      case 3:
        vendors = context$1$0.sent;

        res.status(200).json(vendors);
        context$1$0.next = 10;
        break;

      case 7:
        context$1$0.prev = 7;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: 'Gagal mengambil data vendor', error: context$1$0.t0 });

      case 10:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 7]]);
};

exports.getAllVendors = getAllVendors;
// Fungsi untuk mendapatkan vendor berdasarkan ID
var getVendorById = function getVendorById(req, res) {
  var vendor;
  return regeneratorRuntime.async(function getVendorById$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsVendorModelJs2["default"].findByPk(req.params.id));

      case 3:
        vendor = context$1$0.sent;

        if (vendor) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: 'Vendor tidak ditemukan' }));

      case 6:
        res.status(200).json(vendor);
        context$1$0.next = 12;
        break;

      case 9:
        context$1$0.prev = 9;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: 'Gagal mengambil data vendor', error: context$1$0.t0 });

      case 12:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 9]]);
};

exports.getVendorById = getVendorById;
// Fungsi untuk menambahkan vendor baru
var createVendor = function createVendor(req, res) {
  var _req$body, vendor_name, stock_information, vendor_address, contact, newVendor;

  return regeneratorRuntime.async(function createVendor$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        _req$body = req.body;
        vendor_name = _req$body.vendor_name;
        stock_information = _req$body.stock_information;
        vendor_address = _req$body.vendor_address;
        contact = _req$body.contact;
        context$1$0.next = 8;
        return regeneratorRuntime.awrap(_modelsVendorModelJs2["default"].create({ vendor_name: vendor_name, stock_information: stock_information, vendor_address: vendor_address, contact: contact }));

      case 8:
        newVendor = context$1$0.sent;

        res.status(201).json({ message: 'Vendor berhasil ditambahkan', newVendor: newVendor });
        context$1$0.next = 15;
        break;

      case 12:
        context$1$0.prev = 12;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: 'Gagal menambahkan vendor', error: context$1$0.t0 });

      case 15:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 12]]);
};

exports.createVendor = createVendor;
// Fungsi untuk memperbarui data vendor
var updateVendor = function updateVendor(req, res) {
  var vendor, _req$body2, vendor_name, stock_information, vendor_address, contact;

  return regeneratorRuntime.async(function updateVendor$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsVendorModelJs2["default"].findByPk(req.params.id));

      case 3:
        vendor = context$1$0.sent;

        if (vendor) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: 'Vendor tidak ditemukan' }));

      case 6:
        _req$body2 = req.body;
        vendor_name = _req$body2.vendor_name;
        stock_information = _req$body2.stock_information;
        vendor_address = _req$body2.vendor_address;
        contact = _req$body2.contact;
        context$1$0.next = 13;
        return regeneratorRuntime.awrap(vendor.update({ vendor_name: vendor_name, stock_information: stock_information, vendor_address: vendor_address, contact: contact }));

      case 13:

        res.status(200).json({ message: 'Vendor berhasil diperbarui', vendor: vendor });
        context$1$0.next = 19;
        break;

      case 16:
        context$1$0.prev = 16;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: 'Gagal memperbarui vendor', error: context$1$0.t0 });

      case 19:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 16]]);
};

exports.updateVendor = updateVendor;
// Fungsi untuk menghapus vendor
var deleteVendor = function deleteVendor(req, res) {
  var vendor;
  return regeneratorRuntime.async(function deleteVendor$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.prev = 0;
        context$1$0.next = 3;
        return regeneratorRuntime.awrap(_modelsVendorModelJs2["default"].findByPk(req.params.id));

      case 3:
        vendor = context$1$0.sent;

        if (vendor) {
          context$1$0.next = 6;
          break;
        }

        return context$1$0.abrupt("return", res.status(404).json({ message: 'Vendor tidak ditemukan' }));

      case 6:
        context$1$0.next = 8;
        return regeneratorRuntime.awrap(vendor.destroy());

      case 8:
        res.status(200).json({ message: 'Vendor berhasil dihapus' });
        context$1$0.next = 14;
        break;

      case 11:
        context$1$0.prev = 11;
        context$1$0.t0 = context$1$0["catch"](0);

        res.status(500).json({ message: 'Gagal menghapus vendor', error: context$1$0.t0 });

      case 14:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this, [[0, 11]]);
};
exports.deleteVendor = deleteVendor;