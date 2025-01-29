import express from "express";
import {
  getAllMedicines,
  getMedicineById,
  createMedicine,
  updateMedicine,
} from "../controllers/MedicineController.js";

const router = express.Router();

// Definisi route
router.get('/medicines', getAllMedicines);             // Mendapatkan semua data obat
router.get('/medicines/:id', getMedicineById);         // Mendapatkan data obat berdasarkan ID
router.post('/medicines', createMedicine);             // Menambahkan obat baru
router.put('/medicines/:id', updateMedicine);          // Memperbarui data obat berdasarkan ID

export default router;
