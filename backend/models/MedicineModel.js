import { Sequelize } from 'sequelize';
import db from '../config/Database.js'; 

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
  price: {
    type: DataTypes.INTEGER, // Menyimpan harga dengan dua angka desimal
    allowNull: false, // Harga default jika tidak ditentukan
  },
  medicine_image: {
    type: DataTypes.STRING,  // URL gambar obat (atau path lokal)
    allowNull: true,         // Bisa opsional jika tidak ada gambar
  },
}, {
  tableName: 'medicine',     // Nama tabel sesuai dengan database
  timestamps: false,           // Menggunakan createdAt dan updatedAt
});

export default Medicine;
