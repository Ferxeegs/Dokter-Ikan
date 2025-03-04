"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _sequelize = require("sequelize");

var _configDatabaseJs = require("../config/Database.js");

var _configDatabaseJs2 = _interopRequireDefault(_configDatabaseJs);

var DataTypes = _sequelize.Sequelize.DataTypes;

var FishTypes = _configDatabaseJs2["default"].define('FishType', {
  fish_type_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  other_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  latin_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  habitat: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'fishtype',
  timestamps: false });

// Mengaktifkan createdAt dan updatedAt
exports["default"] = FishTypes;
module.exports = exports["default"];