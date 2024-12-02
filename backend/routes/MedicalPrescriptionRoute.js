import express from 'express';
import {
  getAllMedicalPrescriptions,
  getMedicalPrescriptionById,
  createMedicalPrescription,
  updateMedicalPrescription,
  deleteMedicalPrescription
} from '../controllers/MedicalPrescriptionController.js';

const router = express.Router();

// Definisi route untuk resep medis
router.get('/prescriptions', getAllMedicalPrescriptions);
router.get('/prescriptions/:id', getMedicalPrescriptionById);
router.post('/prescriptions', createMedicalPrescription);
router.put('/prescriptions/:id', updateMedicalPrescription);
router.delete('/prescriptions/:id', deleteMedicalPrescription);

export default router;
