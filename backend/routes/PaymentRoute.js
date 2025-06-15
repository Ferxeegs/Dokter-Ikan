import express from 'express';
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentByConsultationId,
  getPaymentHistoryByUser
} from '../controllers/PaymentController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { checkConsultationOwnership } from '../middlewares/Authorization.js';

const router = express.Router();

router.get('/payments', getAllPayments); 
router.get('/payments/:id', authenticate, checkConsultationOwnership, getPaymentById); 
router.post('/payments', createPayment); 
router.put('/payments/:id', updatePayment); 
router.delete('/payments/:id', deletePayment); 
router.get("/paymentsbyconsultation", getPaymentByConsultationId);
router.get("/payments/history/:userId", getPaymentHistoryByUser);

export default router;
