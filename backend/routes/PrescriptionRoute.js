import express from 'express';
import { createPrescription, getAllPrescriptions, getPrescriptionsByConsultationId} from '../controllers/PrescriptionController.js';

const router = express.Router();

// Definisi route untuk resep medis
router.get('/prescriptions', getAllPrescriptions);
router.get('/prescriptionsbyconsultation', getPrescriptionsByConsultationId);
router.post('/prescriptions', createPrescription);

export default router;
