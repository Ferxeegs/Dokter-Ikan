import express from 'express';
import { createPrescription, getAllPrescriptions, getPrescriptionsByConsultationId, checkPrescriptionExists} from '../controllers/PrescriptionController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Definisi route untuk resep medis
router.get('/prescriptions', getAllPrescriptions);
router.get('/prescriptionsbyconsultation', getPrescriptionsByConsultationId);
router.post('/prescriptions', createPrescription);
router.get('/check/:consultation_id', authenticate, checkPrescriptionExists);


export default router;
