'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sequelize = require('sequelize');

var _configDatabaseJs = require('../config/Database.js');

var _configDatabaseJs2 = _interopRequireDefault(_configDatabaseJs);

// Import model-model terkait untuk relasi

var _UserModelJs = require('./UserModel.js');

var _UserModelJs2 = _interopRequireDefault(_UserModelJs);

var _UserConsultationModelJs = require('./UserConsultationModel.js');

var _UserConsultationModelJs2 = _interopRequireDefault(_UserConsultationModelJs);

var _FishExpertsModelJs = require('./FishExpertsModel.js');

var _FishExpertsModelJs2 = _interopRequireDefault(_FishExpertsModelJs);

var _FishExpertAnswerModelJs = require('./FishExpertAnswerModel.js');

var _FishExpertAnswerModelJs2 = _interopRequireDefault(_FishExpertAnswerModelJs);

var DataTypes = _sequelize.Sequelize.DataTypes;

var Consultation = _configDatabaseJs2['default'].define('Consultation', {
  consultation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: _UserModelJs2['default'],
      key: 'user_id'
    }
  },
  user_consultation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: _UserConsultationModelJs2['default'],
      key: 'user_consultation_id'
    }
  },
  fishExpert_id: {
    type: DataTypes.INTEGER,
    references: {
      model: _FishExpertsModelJs2['default'],
      key: 'fishExpert_id'
    }
  },
  fish_expert_answer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: _FishExpertAnswerModelJs2['default'],
      key: 'fish_expert_answer_id'
    }
  },
  chat_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  consultation_status: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'consultation',
  timestamps: true,
  createdAt: 'created_at', // Gunakan nama kolom yang benar
  updatedAt: 'updated_at' // createdAt dan updatedAt otomatis diaktifkan
});

// Definisi relasi dengan model terkait
Consultation.belongsTo(_UserModelJs2['default'], { foreignKey: 'user_id' });
Consultation.belongsTo(_UserConsultationModelJs2['default'], { foreignKey: 'user_consultation_id' });
Consultation.belongsTo(_FishExpertsModelJs2['default'], { foreignKey: 'fishExpert_id' });
Consultation.belongsTo(_FishExpertAnswerModelJs2['default'], { foreignKey: 'fish_expert_answer_id' });

exports['default'] = Consultation;
module.exports = exports['default'];