import express from 'express';
import {
  getAllConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  deleteConsultation
} from '../controllers/ConsultationController.js';

const router = express.Router();

// Definisi route untuk mendapatkan semua konsultasi
router.get('/consultations', getAllConsultations);
router.get('/consultations/:id', getConsultationById);
router.post('/consultations', createConsultation);
router.put('/consultations/:id', updateConsultation);
router.delete('/consultations/:id', deleteConsultation);

export default router;
