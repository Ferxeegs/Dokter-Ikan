import express from "express";
import {
  getFishDiseases,
  getFishDiseaseById,
} from "../controllers/FishDiseaseController.js";

const router = express.Router();

router.get("/fishdiseases", getFishDiseases); // Get all diseases
router.get("/fishdiseases/:id", getFishDiseaseById); // Get disease by ID


export default router;
