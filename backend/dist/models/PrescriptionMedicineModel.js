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

var _MedicineModelJs = require('./MedicineModel.js');

var _MedicineModelJs2 = _interopRequireDefault(_MedicineModelJs);

var DataTypes = _sequelize.Sequelize.DataTypes;

var PrescriptionMedicine = _configDatabaseJs2['default'].define('prescriptions_medicine', {
  prescription_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: _PrescriptionModelJs2['default'],
      key: 'prescription_id'
    }
  },
  medicine_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: _MedicineModelJs2['default'],
      key: 'medicine_id'
    }
  }
}, {
  tableName: 'prescription_medicines',
  timestamps: false
});

_PrescriptionModelJs2['default'].belongsToMany(_MedicineModelJs2['default'], { through: PrescriptionMedicine, foreignKey: 'prescription_id' });
_MedicineModelJs2['default'].belongsToMany(_PrescriptionModelJs2['default'], { through: PrescriptionMedicine, foreignKey: 'medicine_id' });

exports['default'] = PrescriptionMedicine;
module.exports = exports['default'];