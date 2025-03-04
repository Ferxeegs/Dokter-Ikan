'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sequelize = require('sequelize');

var _configDatabaseJs = require('../config/Database.js');

var _configDatabaseJs2 = _interopRequireDefault(_configDatabaseJs);

var DataTypes = _sequelize.Sequelize.DataTypes;

var OtpVerification = _configDatabaseJs2['default'].define('OtpVerification', {
  otp_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  otp_code: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  otp_expiry: {
    type: DataTypes.DATE,
    allowNull: false
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'otp_verification',
  timestamps: false
});

exports['default'] = OtpVerification;
module.exports = exports['default'];