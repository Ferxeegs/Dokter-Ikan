import express from 'express';
import { 
    getAllUserConsultations, 
    getUserConsultationById, 
    createUserConsultation,
    getUserConsultationHistory, 
    
} from '../controllers/UserConsultationController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { validateConsultation } from '../middlewares/validateConsultation.js';

const router = express.Router();

router.get('/user-consultations', authenticate, getAllUserConsultations);
router.get('/user-consultations/:id', getUserConsultationById);
router.post('/user-consultations', authenticate, validateConsultation, createUserConsultation);
router.get('/user-consultation',authenticate,getUserConsultationHistory);

export default router;
