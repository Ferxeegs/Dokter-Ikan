import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

// Mendefinisikan model Vendor
const Vendor = db.define('Vendor', {
  vendor_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vendor_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stock_information: {
    type: DataTypes.TEXT,
    allowNull: true  // Opsional, tergantung pada kebutuhan Anda
  },
  vendor_address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'vendor',  // Nama tabel sesuai dengan database
  timestamps: false  // Jika tidak menggunakan kolom createdAt dan updatedAt
});

export default Vendor;
