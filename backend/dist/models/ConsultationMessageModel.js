"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _sequelize = require("sequelize");

var _configDatabaseJs = require("../config/Database.js");

var _configDatabaseJs2 = _interopRequireDefault(_configDatabaseJs);

var _ConsultationModelJs = require("./ConsultationModel.js");

var _ConsultationModelJs2 = _interopRequireDefault(_ConsultationModelJs);

var DataTypes = _sequelize.Sequelize.DataTypes;

var ConsultationMessage = _configDatabaseJs2["default"].define("ConsultationMessage", {
  message_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  consultation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: _ConsultationModelJs2["default"],
      key: "consultation_id"
    }
  },
  sender_role: {
    type: DataTypes.ENUM("user", "expert"),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: "consultation_messages",
  timestamps: true, // Menyimpan waktu pengiriman pesan
  underscored: true
});

// Relasi dengan Consultation
_ConsultationModelJs2["default"].hasMany(ConsultationMessage, { foreignKey: "consultation_id" });
ConsultationMessage.belongsTo(_ConsultationModelJs2["default"], { foreignKey: "consultation_id" });

exports["default"] = ConsultationMessage;
module.exports = exports["default"];