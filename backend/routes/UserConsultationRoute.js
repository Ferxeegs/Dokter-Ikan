import express from 'express';
import { 
    getAllUserConsultations, 
    getUserConsultationById, 
    createUserConsultation,
    deleteUserConsultation 
} from '../controllers/UserConsultationController.js';

const router = express.Router();

router.get('/user-consultations', getAllUserConsultations);
router.get('/user-consultations/:id', getUserConsultationById);
router.post('/user-consultations', createUserConsultation);
router.delete('/user-consultations', deleteUserConsultation);

export default router;
