import express from 'express';
import { startRegistration, verifyOtp, completeRegistration, forgotPassword, resetPassword, verifyTokenFromCookie, logoutUser } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/start-registration', startRegistration); 
router.post('/verify-otp', verifyOtp); 
router.post('/complete-registration', completeRegistration);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify-token', verifyTokenFromCookie);
router.post('/logout', logoutUser);

export default router;
