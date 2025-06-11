import { DataTypes } from 'sequelize';
import sequelize from '../config/Database.js';
import User from './UserModel.js';

const PasswordReset = sequelize.define('PasswordReset', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    },
    onDelete: 'CASCADE'
  },
  reset_token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reset_token_expiry: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'password_resets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Hubungkan ke User
PasswordReset.belongsTo(User, { foreignKey: 'user_id' });

export default PasswordReset;
