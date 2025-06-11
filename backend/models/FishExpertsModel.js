import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const FishExperts = db.define('FishExperts', {
  fishExperts_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specialization: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  experience: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
    validate: {
      isEmail: true, 
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'expert', 
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: true, 
    validate: {
      isUrl: true, 
    },
  },
}, {
  tableName: 'fishexperts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

export default FishExperts;
