import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Consultation from './ConsultationModel.js';
import FishExperts from './FishExpertsModel.js'; // Asumsikan ada model FishExpert

const { DataTypes } = Sequelize;

const Prescription = db.define('Prescription', {
  prescription_id: {
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
  fishExperts_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: FishExperts,
      key: 'fishExperts_id'
    }
  },
  instruction: {
    type: DataTypes.TEXT,
  },
  created_at: { 
    type: DataTypes.DATE,
    allowNull: false
  },
  updated_at: { 
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'prescriptions',
  timestamps: true, 
  createdAt: 'created_at', 
  updatedAt: 'updated_at' 
});

// Relasi dengan model Consultation
Prescription.belongsTo(Consultation, { foreignKey: 'consultation_id' });

// Relasi dengan model FishExpert
Prescription.belongsTo(FishExperts, { foreignKey: 'fishExperts_id' });

export default Prescription;