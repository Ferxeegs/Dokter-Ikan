'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sequelize = require('sequelize');

var _configDatabaseJs = require('../config/Database.js');

var _configDatabaseJs2 = _interopRequireDefault(_configDatabaseJs);

var _PrescriptionModelJs = require('./PrescriptionModel.js');

var _PrescriptionModelJs2 = _interopRequireDefault(_PrescriptionModelJs);

var _ConsultationModelJs = require('./ConsultationModel.js');

var _ConsultationModelJs2 = _interopRequireDefault(_ConsultationModelJs);

var DataTypes = _sequelize.Sequelize.DataTypes;

var Payment = _configDatabaseJs2['default'].define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  consultation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: _ConsultationModelJs2['default'],
      key: 'consultation_id'
    }
  },
  prescription_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: _PrescriptionModelJs2['default'],
      key: 'prescription_id'
    }
  },
  total_fee: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  shipping_fee: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: true
  },
  payment_proof: {
    type: DataTypes.STRING,
    allowNull: true // URL atau path gambar bukti pembayaran
  },
  payment_status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
    allowNull: false
  }
}, {
  tableName: 'payment',
  timestamps: true
});

Payment.belongsTo(_ConsultationModelJs2['default'], { foreignKey: 'consultation_id' });
Payment.belongsTo(_PrescriptionModelJs2['default'], { foreignKey: 'prescription_id' });

exports['default'] = Payment;
module.exports = exports['default'];