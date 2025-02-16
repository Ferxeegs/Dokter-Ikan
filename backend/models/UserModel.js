import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const User = db.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: 'Email sudah terdaftar'
    },
    validate: {
      isEmail: {
        args: true,
        msg: 'Format email tidak valid'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: {
      args: true,
      msg: 'Nomor HP sudah terdaftar'
    },
    validate: {
      isNumeric: {
        args: true,
        msg: 'Nomor HP hanya boleh berisi angka'
      },
      len: {
        args: [10, 15],
        msg: 'Nomor HP harus terdiri dari 10-15 digit'
      }
    }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  province: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  district: {
    type: DataTypes.STRING,
    allowNull: true
  },
  village: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'default-avatar.png' // Default gambar profil
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  }
}, {
  tableName: 'user',
  timestamps: true,
  createdAt: 'created_at', // Gunakan nama kolom yang benar
  updatedAt: 'updated_at' // createdAt dan updatedAt otomatis diaktifkan
});

export default User;
