import express from 'express';
import { startRegistration, verifyOtp, completeRegistration, forgotPassword, resetPassword } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/start-registration', startRegistration); // Route untuk memulai registrasi
router.post('/verify-otp', verifyOtp); // Route untuk verifikasi OTP
router.post('/complete-registration', completeRegistration); // Route untuk melengkapi pendaftaran
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
