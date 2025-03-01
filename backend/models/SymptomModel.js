import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Symptom = db.define(
  `Symptom`,
  {
    symptoms_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM("fisik", "perilaku"),
      allowNull: false,
    },
  },
  {
    tableName: "symptoms",
    timestamps: false, // Jika tidak ingin menggunakan createdAt dan updatedAt
  }
);

export default Symptom;
