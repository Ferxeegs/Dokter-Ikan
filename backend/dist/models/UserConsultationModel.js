"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _sequelize = require("sequelize");

var _configDatabaseJs = require("../config/Database.js");

var _configDatabaseJs2 = _interopRequireDefault(_configDatabaseJs);

var _modelsUserModelJs = require("../models/UserModel.js");

var _modelsUserModelJs2 = _interopRequireDefault(_modelsUserModelJs);

// Pastikan import ini benar

var _FishTypeModelJs = require("./FishTypeModel.js");

var _FishTypeModelJs2 = _interopRequireDefault(_FishTypeModelJs);

var DataTypes = _sequelize.Sequelize.DataTypes;

var UserConsultation = _configDatabaseJs2["default"].define("UserConsultation", {
  user_consultation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fish_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fish_age: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fish_length: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fish_weight: {
    type: DataTypes.STRING,
    allowNull: false
  },
  consultation_topic: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fish_image: {
    type: DataTypes.STRING,
    allowNull: true },
  // Jika gambar opsional
  complaint: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  consultation_status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Waiting" }
}, // Nilai default
{
  tableName: "userconsultation", // Nama tabel di database
  timestamps: true, // Aktifkan timestamps untuk createdAt dan updatedAt
  underscored: true });

// Definisi asosiasi
// Gunakan snake_case untuk kolom timestamps
UserConsultation.belongsTo(_modelsUserModelJs2["default"], { foreignKey: "user_id" });
UserConsultation.belongsTo(_FishTypeModelJs2["default"], { foreignKey: "fish_type_id" });

exports["default"] = UserConsultation;
module.exports = exports["default"];