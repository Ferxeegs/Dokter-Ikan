import express from 'express';
import { upload, uploadFiles, getFiles, deleteFile } from '../controllers/UploadController.js';
import { uploadFishImage } from '../controllers/UploadFIshController.js';
import { uploadcloud, uploadImages, deleteImage } from "../controllers/UploadCloudinaryController.js";

const router = express.Router();

router.post('/upload', upload.array('files'), uploadFiles);
router.post('/upload-fish', uploadFishImage);
router.get('/uploads', getFiles);
router.delete('/delete-file', deleteFile);
router.post("/uploadcloud", uploadcloud, uploadImages);
router.delete("/delete", deleteImage);

export default router;
