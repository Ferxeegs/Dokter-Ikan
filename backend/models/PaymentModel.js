import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Prescription from './PrescriptionModel.js'; 
import Consultation from './ConsultationModel.js'; // Harus diimpor agar foreign key valid

const { DataTypes } = Sequelize;

const Payment = db.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  consultation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Consultation,
      key: 'consultation_id'
    }
  },
  prescription_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Prescription,
      key: 'prescription_id'
    }
  },
  total_fee: {
    type: DataTypes.INTEGER, // Pakai INTEGER karena ini harga
    allowNull: false
  },
  payment_status: {
    type: DataTypes.STRING,
    defaultValue: "pending",
    allowNull: false
  }
}, {
  tableName: 'payment',
  timestamps: true 
});

// Relasi dengan Consultation dan Prescription
Payment.belongsTo(Consultation, { foreignKey: 'consultation_id' });
Payment.belongsTo(Prescription, { foreignKey: 'prescription_id' });

export default Payment;
