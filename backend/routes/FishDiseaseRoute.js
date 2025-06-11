import express from "express";
import {
  getFishDiseases,
  diagnoseFish,
  getFishDiseasesByNames
} from "../controllers/FishDiseaseController.js";

const router = express.Router();

router.get("/fishdiseases", getFishDiseases); 
router.post("/diagnose", diagnoseFish);
router.post("/fishdiseases", getFishDiseasesByNames); 



export default router;
