import { Sequelize } from 'sequelize';
import db from '../config/Database.js';

// Import model-model terkait untuk relasi
import User from './UserModel.js';
import UserConsultation from './UserConsultationModel.js';
import FishExpert from './FishExpertsModel.js';
import FishExpertAnswer from './FishExpertAnswerModel.js';

const { DataTypes } = Sequelize;

const Consultation = db.define('Consultation', {
  consultation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  user_consultation_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: UserConsultation,
      key: 'user_consultation_id',
    },
  },
  fishExpert_id: {
    type: DataTypes.INTEGER,
    references: {
      model: FishExpert,
      key: 'fishExpert_id',
    },
  },
  fish_expert_answer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: FishExpertAnswer,
      key: 'fish_expert_answer_id',
    },
  },
  chat_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  consultation_status: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'consultation',
  timestamps: false, // createdAt dan updatedAt otomatis diaktifkan
});

// Definisi relasi dengan model terkait
Consultation.belongsTo(User, { foreignKey: 'user_id' });
Consultation.belongsTo(UserConsultation, { foreignKey: 'user_consultation_id' });
Consultation.belongsTo(FishExpert, { foreignKey: 'fishExpert_id' });
Consultation.belongsTo(FishExpertAnswer, { foreignKey: 'fish_expert_answer_id' });

export default Consultation;
