import express from 'express';
import {
  getAllFishTypes,
  getFishTypeById,
  getFishTypeByName,
} from '../controllers/FishTypeController.js';

const router = express.Router();

// Definisi route untuk jenis ikan
router.get('/fish-types', getAllFishTypes);
router.get('/fish-types/:id', getFishTypeById);
router.get("/fish/search", getFishTypeByName);

export default router;
