'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sequelize = require('sequelize');

var _configDatabaseJs = require('../config/Database.js');

var _configDatabaseJs2 = _interopRequireDefault(_configDatabaseJs);

// Pastikan path ini benar dan sesuai dengan konfigurasi database Anda

var _VendorModelJs = require('./VendorModel.js');

var _VendorModelJs2 = _interopRequireDefault(_VendorModelJs);

// Mengimpor model Vendor sebagai foreign key

var DataTypes = _sequelize.Sequelize.DataTypes;

var Medicine = _configDatabaseJs2['default'].define('Medicine', {
  medicine_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  medicine_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contain: {
    type: DataTypes.STRING, // Kandungan obat
    allowNull: false
  },
  dosage: {
    type: DataTypes.TEXT, // Dosis obat
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER, // Menyimpan harga dengan dua angka desimal
    allowNull: false },
  // Harga default jika tidak ditentukan
  medicine_image: {
    type: DataTypes.STRING, // URL gambar obat (atau path lokal)
    allowNull: true }
}, // Bisa opsional jika tidak ada gambar
{
  tableName: 'medicine', // Nama tabel sesuai dengan database
  timestamps: false });

// Menggunakan createdAt dan updatedAt
Medicine.belongsTo(_VendorModelJs2['default'], { foreignKey: 'vendor_id' }); // Relasi dengan tabel Vendor

exports['default'] = Medicine;
module.exports = exports['default'];