"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _sequelize = require("sequelize");

var _configDatabaseJs = require("../config/Database.js");

var _configDatabaseJs2 = _interopRequireDefault(_configDatabaseJs);

var DataTypes = _sequelize.Sequelize.DataTypes;

var Symptom = _configDatabaseJs2["default"].define("Symptom", {
  symptoms_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.ENUM("fisik", "perilaku"),
    allowNull: false
  }
}, {
  tableName: "symptoms",
  timestamps: false });

// Jika tidak ingin menggunakan createdAt dan updatedAt
exports["default"] = Symptom;
module.exports = exports["default"];