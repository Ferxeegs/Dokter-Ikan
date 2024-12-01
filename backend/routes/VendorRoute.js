import express from "express";
import {
    getAllVendors,
    getVendorById,
    createVendor,
    updateVendor,
    deleteVendor
} from "../controllers/VendorController.js";

const router = express.Router();
router.get('/vendors', getAllVendors);
router.get('/vendors/:id', getVendorById);
router.post('/vendors', createVendor);
router.put('/vendors/:id', updateVendor);
router.delete('/vendors/:id', deleteVendor);

export default router;
