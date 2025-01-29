import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  loginUser,
  getMe,
} from "../controllers/UserController.js";
import { authenticate } from "../middlewares/authMiddleware.js"; // Impor middleware authenticate

const router = express.Router();

// Rute yang tidak memerlukan autentikasi
router.post('/register', createUser); // Mendaftar pengguna baru
router.post('/login', loginUser); // Login pengguna

// Rute yang memerlukan autentikasi
router.get('/users', authenticate, getAllUsers); // Mendapatkan semua pengguna (diperlukan autentikasi)
router.get('/users/:id', authenticate, getUserById); // Mendapatkan pengguna berdasarkan ID (diperlukan autentikasi)
router.put('/users/:id', authenticate, updateUser); // Memperbarui pengguna berdasarkan ID (diperlukan autentikasi)
router.get('/me', authenticate, getMe);


export default router;
