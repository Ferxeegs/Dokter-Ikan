import express from 'express';
import {
  getAllConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation,
  getConsultationHistory
} from '../controllers/ConsultationController.js';
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Definisi route untuk mendapatkan semua konsultasi
router.get('/consultations', getAllConsultations);
router.get('/consultations/:id', getConsultationById);
router.get('/consultation', authenticate, getConsultationHistory)
router.post('/consultations', authenticate, createConsultation);
router.put('/consultations/:id', updateConsultation);
router.delete('/consultations/:id', deleteConsultation);

export default router;
