"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _sequelize = require("sequelize");

var _configDatabaseJs = require("../config/Database.js");

var _configDatabaseJs2 = _interopRequireDefault(_configDatabaseJs);

var DataTypes = _sequelize.Sequelize.DataTypes;

var FishExperts = _configDatabaseJs2["default"].define('FishExperts', {
  fishExperts_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  specialization: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  experience: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Email harus unik
    validate: {
      isEmail: true }
  },
  // Validasi format email
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'expert' },
  // Role default sebagai 'expert'
  image_url: {
    type: DataTypes.STRING,
    allowNull: true, // Bisa kosong jika belum ada gambar
    validate: {
      isUrl: true }
  }
}, // Validasi format URL
{
  tableName: 'fishexperts',
  timestamps: true,
  createdAt: 'created_at', // Gunakan nama kolom yang benar
  updatedAt: 'updated_at' });

// Menonaktifkan createdAt dan updatedAt
exports["default"] = FishExperts;
module.exports = exports["default"];