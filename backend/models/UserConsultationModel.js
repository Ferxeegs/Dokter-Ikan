import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "../models/UserModel.js"; 
import FishTypes from "./FishTypeModel.js";

const { DataTypes } = Sequelize;

const UserConsultation = db.define(
  "UserConsultation",
  {
    user_consultation_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fish_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fish_age: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fish_length: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fish_weight: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    consultation_topic: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    fish_image: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    complaint: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    consultation_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Waiting", 
    },
  },
  {
    tableName: "userconsultation", 
    timestamps: true, 
    underscored: true, 
  }
);

// Definisi asosiasi
UserConsultation.belongsTo(User, { foreignKey: "user_id" });
UserConsultation.belongsTo(FishTypes, { foreignKey: "fish_type_id" });

export default UserConsultation;
