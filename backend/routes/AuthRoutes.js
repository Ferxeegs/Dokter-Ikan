import express from 'express';
import { startRegistration, verifyOtp, completeRegistration } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/start-registration', startRegistration); // Route untuk memulai registrasi
router.post('/verify-otp', verifyOtp); // Route untuk verifikasi OTP
router.post('/complete-registration', completeRegistration); // Route untuk melengkapi pendaftaran

export default router;
