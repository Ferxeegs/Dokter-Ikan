import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import User from '../models/UserModel.js';  // Pastikan import ini benar
import FishTypes from './FishTypeModel.js';

const { DataTypes } = Sequelize;

const UserConsultation = db.define('UserConsultation', {
  user_consultation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fish_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fish_age: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fish_length: {
    type: DataTypes.STRING,
    allowNull: false
  },
  consultation_topic: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  fish_image: {
    type: DataTypes.STRING,
    allowNull: true  // Jika gambar opsional
  },
  complaint: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  consultation_status: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'userconsultation',  // Nama tabel sesuai dengan database
  timestamps: false   // Jika tidak menggunakan kolom createdAt dan updatedAt
});

// Definisi asosiasi (dilakukan setelah semua model diimpor)
UserConsultation.belongsTo(User, { foreignKey: 'user_id' });
UserConsultation.belongsTo(FishTypes, { foreignKey: 'fish_type_id' });

export default UserConsultation;
