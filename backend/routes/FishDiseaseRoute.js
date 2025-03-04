import express from "express";
import {
  getFishDiseases,
  diagnoseFish,
  getFishDiseasesByNames
} from "../controllers/FishDiseaseController.js";

const router = express.Router();

router.get("/fishdiseases", getFishDiseases); // Get all diseases
router.post("/diagnose", diagnoseFish);
router.post("/fishdiseases", getFishDiseasesByNames); // Get fish diseases by names



export default router;
