import express from 'express';
import {
  getAllFishTypes,
  getFishTypeById,
} from '../controllers/FishTypeController.js';

const router = express.Router();

// Definisi route untuk jenis ikan
router.get('/fish-types', getAllFishTypes);
router.get('/fish-types/:id', getFishTypeById);

export default router;
