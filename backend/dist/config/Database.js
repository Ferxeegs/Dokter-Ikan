'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _sequelize = require("sequelize");

var db = new _sequelize.Sequelize('db_dokterikan', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

exports['default'] = db;
module.exports = exports['default'];