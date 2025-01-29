import express from 'express';
import {
  getAllFishDiseases,
  getFishDiseaseById,
  createFishDisease,
  updateFishDisease,
} from '../controllers/FishDiseaseController.js';

const router = express.Router();

router.get('/fish-diseases', getAllFishDiseases);
router.get('/fish-diseases/:id', getFishDiseaseById);
router.post('/fish-diseases', createFishDisease);
router.put('/fish-diseases/:id', updateFishDisease);


export default router;
