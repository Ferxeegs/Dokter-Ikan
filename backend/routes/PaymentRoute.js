import express from 'express';
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment
} from '../controllers/PaymentController.js';

const router = express.Router();

router.get('/payments', getAllPayments);
router.get('/payments/:id', getPaymentById);
router.post('/payments', createPayment);
router.put('/payments/:id', updatePayment);
router.delete('/payments/:id', deletePayment);

export default router;
