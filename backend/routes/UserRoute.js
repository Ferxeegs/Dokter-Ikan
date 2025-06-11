import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  loginUser,
  getMe,
  updatePassword,
  updateProfile,
  updateProfileImage
} from "../controllers/UserController.js";
import { authenticate } from "../middlewares/authMiddleware.js"; 
const router = express.Router();

// Rute yang tidak memerlukan autentikasi
router.post('/login', loginUser);

// Rute yang memerlukan autentikasi
router.get('/users', authenticate, getAllUsers); 
router.get('/users/:id', authenticate, getUserById); 
router.put('/users/:id', authenticate, updateUser); 
router.get('/me', authenticate, getMe);
router.put('/update-password', authenticate, updatePassword);
router.put('/update-profile', authenticate, updateProfile);
router.patch('/update-image-user', authenticate, updateProfileImage); 

export default router;
