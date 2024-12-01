import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const User = db.define('User', {
  user_id: {  // Sesuaikan dengan nama kolom primary key yang ada di database
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true  // Jika kolom ini auto increment
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  }
}, {
  tableName: 'user',  // Nama tabel di database
  timestamps: false   // Jika tidak menggunakan timestamps
});

export default User;
