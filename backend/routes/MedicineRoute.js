import express from "express";
import {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
} from "../controllers/MedicineController.js";

const router = express.Router();

// Definisi route
router.get('/medicines', getAllMedicines);             
router.get('/medicines/:id', getMedicineById);        
router.post('/medicines', createMedicine);            
router.put('/medicines/:id', updateMedicine);         

export default router;
