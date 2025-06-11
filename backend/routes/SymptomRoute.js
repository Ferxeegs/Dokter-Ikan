import express from "express";
import { getSymptoms, getSymptomById } from "../controllers/SymptomController.js";

const router = express.Router();

router.get("/symptoms", getSymptoms); 
router.get("/symptoms/:id", getSymptomById); 

export default router;
