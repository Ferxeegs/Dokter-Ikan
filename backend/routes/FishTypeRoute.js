import express from 'express';
import {
  getAllFishTypes,
  getFishTypeById,
  createFishType,
  updateFishType,
  deleteFishType
} from '../controllers/FishTypeController.js';

const router = express.Router();

// Definisi route untuk jenis ikan
router.get('/fish-types', getAllFishTypes);
router.get('/fish-types/:id', getFishTypeById);
router.post('/fish-types', createFishType);
router.put('/fish-types/:id', updateFishType);
router.delete('/fish-types/:id', deleteFishType);

export default router;
