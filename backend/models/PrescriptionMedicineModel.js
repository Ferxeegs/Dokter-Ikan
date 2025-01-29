import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import Prescription from './PrescriptionModel.js';
import Medicine from './MedicineModel.js';

const { DataTypes } = Sequelize;

const PrescriptionMedicine = db.define('prescriptions_medicine', {
  prescription_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Prescription,
      key: 'prescription_id'
    }
  },
  medicine_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Medicine,
      key: 'medicine_id'
    }
  }
}, {
    tableName: 'prescription_medicines',
    timestamps: false
});

Prescription.belongsToMany(Medicine, { through: PrescriptionMedicine, foreignKey: 'prescription_id' });
Medicine.belongsToMany(Prescription, { through: PrescriptionMedicine, foreignKey: 'medicine_id' });

export default PrescriptionMedicine;