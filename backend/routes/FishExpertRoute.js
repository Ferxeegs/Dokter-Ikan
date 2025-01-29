import express from "express";
import {
  getAllFishExperts,
  getFishExpertById,
  createFishExpert,
} from "../controllers/FishExpertController.js";  // Import controller FishExpert

const router = express.Router();

// Definisi route
router.get('/fishexperts', getAllFishExperts);            // Route untuk mendapatkan semua Fish Expert
router.get('/fishexperts/:id', getFishExpertById);        // Route untuk mendapatkan Fish Expert berdasarkan ID
router.post('/fishexperts', createFishExpert);            // Route untuk menambahkan Fish Expert baru

export default router;
