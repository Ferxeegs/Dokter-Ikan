'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sequelize = require('sequelize');

var _configDatabaseJs = require('../config/Database.js');

var _configDatabaseJs2 = _interopRequireDefault(_configDatabaseJs);

var _UserModelJs = require('./UserModel.js');

var _UserModelJs2 = _interopRequireDefault(_UserModelJs);

var PasswordReset = _configDatabaseJs2['default'].define('PasswordReset', {
  id: {
    type: _sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: _sequelize.DataTypes.INTEGER, // Ubah dari UUID ke INTEGER
    allowNull: false,
    references: {
      model: _UserModelJs2['default'],
      key: 'user_id' // Sesuaikan dengan nama kolom di tabel `user`
    },
    onDelete: 'CASCADE'
  },
  reset_token: {
    type: _sequelize.DataTypes.STRING,
    allowNull: false
  },
  reset_token_expiry: {
    type: _sequelize.DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'password_resets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Hubungkan ke User
PasswordReset.belongsTo(_UserModelJs2['default'], { foreignKey: 'user_id' });

exports['default'] = PasswordReset;
module.exports = exports['default'];