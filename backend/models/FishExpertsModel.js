import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

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
  image_url: {
    type: DataTypes.STRING,
    allowNull: true, // Bisa kosong jika belum ada gambar
    validate: {
      isUrl: true, // Validasi format URL
    },
  },
}, {
  tableName: 'fishexperts',
  timestamps: false, // Menonaktifkan createdAt dan updatedAt
});

export default FishExperts;
