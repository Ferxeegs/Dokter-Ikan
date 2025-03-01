import express from "express";
import { getSymptoms, getSymptomById } from "../controllers/SymptomController.js";

const router = express.Router();

router.get("/symptoms", getSymptoms); // Get all symptoms
router.get("/symptoms/:id", getSymptomById); // Get symptom by ID

export default router;
