'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sequelize = require('sequelize');

var _configDatabaseJs = require('../config/Database.js');

var _configDatabaseJs2 = _interopRequireDefault(_configDatabaseJs);

var DataTypes = _sequelize.Sequelize.DataTypes;

// Mendefinisikan model Vendor
var Vendor = _configDatabaseJs2['default'].define('Vendor', {
  vendor_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vendor_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stock_information: {
    type: DataTypes.TEXT,
    allowNull: true // Opsional, tergantung pada kebutuhan Anda
  },
  vendor_address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'vendor', // Nama tabel sesuai dengan database
  timestamps: false // Jika tidak menggunakan kolom createdAt dan updatedAt
});

exports['default'] = Vendor;
module.exports = exports['default'];