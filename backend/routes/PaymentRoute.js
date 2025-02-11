import express from 'express';
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentByConsultationId
} from '../controllers/PaymentController.js';

const router = express.Router();

router.get('/payments', getAllPayments); // Ambil semua pembayaran
router.get('/payments/:id', getPaymentById); // Ambil pembayaran berdasarkan ID
router.post('/payments', createPayment); // Tambah pembayaran baru
router.patch('/payments/:id', updatePayment); // Update status pembayaran
router.delete('/payments/:id', deletePayment); // Hapus pembayaran
router.get("/paymentsbyconsultation", getPaymentByConsultationId);

export default router;
