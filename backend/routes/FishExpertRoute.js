import express from "express";
import {
  getAllFishExperts,
  getFishExpertById,
  createFishExpert,
  updateFishExpertPassword,
} from "../controllers/FishExpertController.js";  // Import controller FishExpert
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Definisi route
router.get('/fishexperts', getAllFishExperts);            // Route untuk mendapatkan semua Fish Expert
router.get('/fishexperts/:id', getFishExpertById);        // Route untuk mendapatkan Fish Expert berdasarkan ID
router.post('/fishexperts', createFishExpert);   
router.put('/update-expert-password', authenticate, updateFishExpertPassword);         // Route untuk menambahkan Fish Expert baru

export default router;
