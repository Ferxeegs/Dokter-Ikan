import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import FishExpert from "./FishExpertsModel.js";

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
        model: FishExpert, 
        key: "fishExperts_id", 
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
      type: DataTypes.STRING, 
      allowNull: true,
    },
  },
  {
    tableName: "fishexpertanswer", 
    timestamps: false, 
  }
);

// Relasi dengan FishExpert
FishExpertAnswer.belongsTo(FishExpert, { foreignKey: "fishExpert_id" });

export default FishExpertAnswer;
