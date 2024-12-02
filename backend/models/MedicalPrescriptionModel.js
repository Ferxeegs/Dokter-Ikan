import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Consultation from './ConsultationModel.js';
import Medicine from './MedicineModel.js';

const { DataTypes } = Sequelize;

const MedicalPrescription = db.define('MedicalPrescription', {
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
  medicine_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Medicine,
      key: 'medicine_id'
    }
  },
  prescription_date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dose: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  instruction: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'medicalprescription',
  timestamps: false  // Jika tabel tidak memiliki createdAt dan updatedAt
});

// Relasi dengan model Consultation
MedicalPrescription.belongsTo(Consultation, { foreignKey: 'consultation_id' });

// Relasi dengan model Medicine
MedicalPrescription.belongsTo(Medicine, { foreignKey: 'medicine_id' });

export default MedicalPrescription;
