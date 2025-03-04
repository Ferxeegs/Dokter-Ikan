"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _sequelize = require("sequelize");

var _configDatabaseJs = require("../config/Database.js");

var _configDatabaseJs2 = _interopRequireDefault(_configDatabaseJs);

var _FishExpertsModelJs = require("./FishExpertsModel.js");

var _FishExpertsModelJs2 = _interopRequireDefault(_FishExpertsModelJs);

// Asumsi model FishExpert sudah ada

var DataTypes = _sequelize.Sequelize.DataTypes;

var FishExpertAnswer = _configDatabaseJs2["default"].define("FishExpertAnswer", {
  fish_expert_answer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fishExpert_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: _FishExpertsModelJs2["default"], // Relasi ke FishExpert
      key: "fishExperts_id" }
  },
  // Pastikan sesuai dengan nama PK di model FishExpert
  answer: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  consultation_status: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING, // Menyimpan URL gambar
    allowNull: true
  }
}, {
  tableName: "fishexpertanswer", // Nama tabel di database
  timestamps: false });

// Relasi dengan FishExpert
// Nonaktifkan createdAt dan updatedAt
FishExpertAnswer.belongsTo(_FishExpertsModelJs2["default"], { foreignKey: "fishExpert_id" });

exports["default"] = FishExpertAnswer;
module.exports = exports["default"];