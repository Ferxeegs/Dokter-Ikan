import express from "express";
import {
  getAllFishExperts,
  getFishExpertById,
  updateFishExpertPassword,
  updateProfileExpert,
  updateProfileImage,
} from "../controllers/FishExpertController.js"; 
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Definisi route
router.get('/fishexperts', getAllFishExperts);            
router.get('/fishexperts/:id', getFishExpertById);       
router.put('/update-expert-password', authenticate, updateFishExpertPassword);    
router.put('/update-profile-expert', authenticate, updateProfileExpert);   
router.patch('/update-image-expert', authenticate, updateProfileImage) 

export default router;
