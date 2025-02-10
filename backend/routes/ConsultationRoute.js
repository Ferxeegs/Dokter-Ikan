import express from 'express';
import {
  getAllConsultations,
  createConsultation,
  updateConsultation,
  getConsultationHistory,
  getConsultation,
  enableChat,
  endConsultation
} from '../controllers/ConsultationController.js';
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Definisi route untuk mendapatkan semua konsultasi
router.get('/consultations', getAllConsultations);
router.get('/consultations/:id', getConsultation);
router.get('/consultation', authenticate, getConsultationHistory)
router.post('/consultations', authenticate, createConsultation);
router.put('/consultations/:id', authenticate, updateConsultation);
router.patch("/consultations/:id/enable-chat", authenticate, enableChat);
router.patch("/consultations/:id/end", authenticate, endConsultation);

export default router;
