// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/Database.js'); // Pastikan ada koneksi database
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const FishExperts = db.define('FishExperts', {
  fishExperts_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specialization: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  experience: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Email harus unik
    validate: {
      isEmail: true, // Validasi format email
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'expert', // Role default sebagai 'expert'
  },
}, {
  tableName: 'fishexperts',
  timestamps: false, // Mengaktifkan createdAt dan updatedAt
});

// module.exports = FishExperts;
export default FishExperts;
