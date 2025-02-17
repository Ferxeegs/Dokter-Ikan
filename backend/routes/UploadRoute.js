import express from 'express';
import { upload, uploadFiles, getFiles, deleteFile } from '../controllers/UploadController.js';
import { uploadFishImage } from '../controllers/UploadFIshController.js';

const router = express.Router();

router.post('/upload', upload.array('files'), uploadFiles);
router.post('/upload-fish', uploadFishImage);
router.get('/uploads', getFiles);
router.delete('/delete-file', deleteFile);

export default router;
