import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Prescription from './PrescriptionModel.js'; // Asosiasi ke resep medis
import User from './UserModel.js'; // Asosiasi ke pengguna

const { DataTypes } = Sequelize;

const Payment = db.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  medical_prescription_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Prescription,
      key: 'prescription_id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  medicine_fee: {
    type: DataTypes.STRING,
    allowNull: false
  },
  consultation_fee: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total_fee: {
    type: DataTypes.STRING,
    allowNull: false
  },
  payment_status: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'payment', // Nama tabel sesuai database
  timestamps: false // Menggunakan kolom createdAt dan updatedAt
});

// Relasi dengan MedicalPrescription dan User
Payment.belongsTo(Prescription, { foreignKey: 'prescription_id' });
Payment.belongsTo(User, { foreignKey: 'user_id' });

export default Payment;
