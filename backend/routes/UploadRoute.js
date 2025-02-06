import express from 'express';
import { upload, uploadFiles, getFiles, deleteFile } from '../controllers/UploadController.js';

const router = express.Router();

router.post('/upload', upload.array('files'), uploadFiles);
router.get('/uploads', getFiles);
router.delete('/delete-file', deleteFile);

export default router;
