import { Sequelize } from 'sequelize';
import db from '../config/Database.js';
import FishType from './FishTypeModel.js'; // Relasi ke tabel FishType

const { DataTypes } = Sequelize;

const FishDisease = db.define('FishDisease', {
  disease_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  fish_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: FishType, // Relasi ke FishType
      key: 'fish_type_id'
    }
  },
  name_disease: {
    type: DataTypes.STRING,
    allowNull: false
  },
  symtomps: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  causes: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  treatment: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'fishdisease', // Nama tabel sesuai database
  timestamps: false // Nonaktifkan createdAt dan updatedAt
});

// Relasi ke FishType
FishDisease.belongsTo(FishType, { foreignKey: 'fish_type_id' });

export default FishDisease;
