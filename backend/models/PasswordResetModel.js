import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";
import FishExperts from "./FishExpertsModel.js";

const { DataTypes } = Sequelize;

const PasswordReset = db.define('password_resets', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fishExpert_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  reset_token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reset_token_expiry: {
    type: DataTypes.DATE,
    allowNull: false
  },
  user_type: {
    type: DataTypes.ENUM('user', 'expert'),
    allowNull: false,
    defaultValue: 'user'
  }
}, {
  freezeTableName: true,
  timestamps: true,
  createdAt: 'created_at', // Match database column name
  updatedAt: 'updated_at', // Match database column name
  validate: {
    eitherUserOrExpert() {
      if ((this.user_id === null && this.fishExpert_id === null) || 
          (this.user_id !== null && this.fishExpert_id !== null)) {
        throw new Error('Either user_id or fishExpert_id must be set, but not both');
      }
    }
  }
});

// Define relationships with proper foreign keys
PasswordReset.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

PasswordReset.belongsTo(FishExperts, {
  foreignKey: 'fishExpert_id',
  as: 'expert'
});

export default PasswordReset;