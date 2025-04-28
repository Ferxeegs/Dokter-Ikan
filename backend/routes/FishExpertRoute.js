import express from "express";
import {
  getAllFishExperts,
  getFishExpertById,
  updateFishExpertPassword,
  updateProfileExpert,
  updateProfileImage,
} from "../controllers/FishExpertController.js";  // Import controller FishExpert
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Definisi route
router.get('/fishexperts', getAllFishExperts);            // Route untuk mendapatkan semua Fish Expert
router.get('/fishexperts/:id', getFishExpertById);        // Route untuk mendapatkan Fish Expert berdasarkan ID
router.put('/update-expert-password', authenticate, updateFishExpertPassword);    
router.put('/update-profile-expert', authenticate, updateProfileExpert);   
router.patch('/update-image-expert', authenticate, updateProfileImage) // Route untuk menambahkan Fish Expert baru

export default router;
