import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import FishExpert from "./FishExpertsModel.js"; // Asumsi model FishExpert sudah ada

const { DataTypes } = Sequelize;

const FishExpertAnswer = db.define(
  "FishExpertAnswer",
  {
    fish_expert_answer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fishExpert_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: FishExpert, // Relasi ke FishExpert
        key: "fishExperts_id", // Pastikan sesuai dengan nama PK di model FishExpert
      },
    },
    answer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    consultation_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING, // Menyimpan URL gambar
      allowNull: true,
    },
  },
  {
    tableName: "fishexpertanswer", // Nama tabel di database
    timestamps: false, // Nonaktifkan createdAt dan updatedAt
  }
);

// Relasi dengan FishExpert
FishExpertAnswer.belongsTo(FishExpert, { foreignKey: "fishExpert_id" });

export default FishExpertAnswer;
