'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sequelize = require('sequelize');

var _configDatabaseJs = require('../config/Database.js');

var _configDatabaseJs2 = _interopRequireDefault(_configDatabaseJs);

var _ConsultationModelJs = require('./ConsultationModel.js');

var _ConsultationModelJs2 = _interopRequireDefault(_ConsultationModelJs);

var _FishExpertsModelJs = require('./FishExpertsModel.js');

var _FishExpertsModelJs2 = _interopRequireDefault(_FishExpertsModelJs);

// Asumsikan ada model FishExpert

var DataTypes = _sequelize.Sequelize.DataTypes;

var Prescription = _configDatabaseJs2['default'].define('Prescription', {
  prescription_id: {
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
  fishExperts_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: _FishExpertsModelJs2['default'],
      key: 'fishExperts_id'
    }
  },
  instruction: {
    type: DataTypes.TEXT
  },
  created_at: { // Sesuaikan dengan nama kolom di database
    type: DataTypes.DATE,
    allowNull: false
  },
  updated_at: { // Sesuaikan dengan nama kolom di database
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'prescriptions',
  timestamps: true, // Aktifkan timestamps
  createdAt: 'created_at', // Arahkan ke kolom created_at di database
  updatedAt: 'updated_at' // Arahkan ke kolom updated_at di database
});

// Relasi dengan model Consultation
Prescription.belongsTo(_ConsultationModelJs2['default'], { foreignKey: 'consultation_id' });

// Relasi dengan model FishExpert
Prescription.belongsTo(_FishExpertsModelJs2['default'], { foreignKey: 'fishExperts_id' });

exports['default'] = Prescription;
module.exports = exports['default'];