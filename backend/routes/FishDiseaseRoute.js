import express from 'express';
import {
  getAllFishDiseases,
  getFishDiseaseById,
  createFishDisease,
  updateFishDisease,
  deleteFishDisease
} from '../controllers/FishDiseaseController.js';

const router = express.Router();

router.get('/fish-diseases', getAllFishDiseases);
router.get('/fish-diseases/:id', getFishDiseaseById);
router.post('/fish-diseases', createFishDisease);
router.put('/fish-diseases/:id', updateFishDisease);
router.delete('/fish-diseases/:id', deleteFishDisease);

export default router;
