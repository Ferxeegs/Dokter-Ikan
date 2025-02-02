import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

const { DataTypes } = Sequelize;

const OtpVerification = db.define('OtpVerification', {
  otp_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  otp_code: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  otp_expiry: {
    type: DataTypes.DATE,
    allowNull: false
  },
  is_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'otp_verification',
  timestamps: false
});

export default OtpVerification;
