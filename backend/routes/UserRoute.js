import express from "express";
import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,

} from "../controllers/UserController.js"
// const express = require('express');

const router = express.Router();
// const UserController = require('../controllers/UserController.js');

// Definisi route
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
// module.exports = router;
