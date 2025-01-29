import express from 'express';
import { createPrescriptionMedicine, getAllPrescriptionMedicines } from '../controllers/PrescriptionMedicineController.js';

const router = express.Router();

router.get('/prescriptions-medicines', getAllPrescriptionMedicines);
router.post('/prescriptions-medicines', createPrescriptionMedicine);

export default router;