import express from "express";
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    loginUser,

} from "../controllers/UserController.js"
// const express = require('express');

const router = express.Router();
// const UserController = require('../controllers/UserController.js');

// Definisi route
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/register', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/login', loginUser);

export default router;
// module.exports = router;
