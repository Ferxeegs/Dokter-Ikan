import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Consultation from "./ConsultationModel.js";

const { DataTypes } = Sequelize;

const ConsultationMessage = db.define(
  "ConsultationMessage",
  {
    message_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    consultation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Consultation,
        key: "consultation_id",
      },
    },
    sender_role: {
      type: DataTypes.ENUM("user", "expert"),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "consultation_messages",
    timestamps: true, // Menyimpan waktu pengiriman pesan
    underscored: true,
  }
);

// Relasi dengan Consultation
Consultation.hasMany(ConsultationMessage, { foreignKey: "consultation_id" });
ConsultationMessage.belongsTo(Consultation, { foreignKey: "consultation_id" });

export default ConsultationMessage;
