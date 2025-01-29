import express from "express";
import {
  getAllFishExpertAnswers,
  getFishExpertAnswerById,
  createFishExpertAnswer,
  updateFishExpertAnswer,
} from "../controllers/FishExpertAnswerController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/fish-expert-answers", getAllFishExpertAnswers);
router.get("/fish-expert-answers/:id", getFishExpertAnswerById);
router.post("/fish-expert-answers", authenticate, createFishExpertAnswer);
router.put("/fish-expert-answers/:id", updateFishExpertAnswer);


export default router;
