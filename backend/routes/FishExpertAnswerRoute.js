import express from "express";
import {
  getAllFishExpertAnswers,
  getFishExpertAnswerById,
  createFishExpertAnswer,
  updateFishExpertAnswer,
  deleteFishExpertAnswer,
} from "../controllers/FishExpertAnswerController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/fish-expert-answers", getAllFishExpertAnswers);
router.get("/fish-expert-answers/:id", getFishExpertAnswerById);
router.post("/fish-expert-answers", authenticate, createFishExpertAnswer);
router.put("/fish-expert-answers/:id", updateFishExpertAnswer);
router.delete("/fish-expert-answers/:id", deleteFishExpertAnswer);

export default router;
