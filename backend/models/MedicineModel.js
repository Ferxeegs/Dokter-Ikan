import { Sequelize } from 'sequelize';
import db from '../config/Database.js'; // Pastikan path ini benar dan sesuai dengan konfigurasi database Anda
import Vendor from './VendorModel.js';  // Mengimpor model Vendor sebagai foreign key

const { DataTypes } = Sequelize;

const Medicine = db.define('Medicine', {
  medicine_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  medicine_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contain: {
    type: DataTypes.STRING,  // Kandungan obat
    allowNull: false,
  },
  dosage: {
    type: DataTypes.TEXT,  // Dosis obat
    allowNull: false,
  },
  medicine_image: {
    type: DataTypes.STRING,  // URL gambar obat (atau path lokal)
    allowNull: true,         // Bisa opsional jika tidak ada gambar
  },
}, {
  tableName: 'medicine',     // Nama tabel sesuai dengan database
  timestamps: false,           // Menggunakan createdAt dan updatedAt
});

Medicine.belongsTo(Vendor, { foreignKey: 'vendor_id' }); // Relasi dengan tabel Vendor

export default Medicine;
