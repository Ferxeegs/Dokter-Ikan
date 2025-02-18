import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Prescription from './PrescriptionModel.js'; 
import Consultation from './ConsultationModel.js';

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
    type: DataTypes.INTEGER,
    allowNull: false
  },
  shipping_fee: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: true
  },
  payment_proof: {
    type: DataTypes.STRING,
    allowNull: true // URL atau path gambar bukti pembayaran
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

Payment.belongsTo(Consultation, { foreignKey: 'consultation_id' });
Payment.belongsTo(Prescription, { foreignKey: 'prescription_id' });

export default Payment;
