import express from 'express';
import { upload, uploadFiles, getFiles, deleteFile } from '../controllers/UploadController.js';
import { uploadFishImage } from '../controllers/UploadFIshController.js';
import { uploadcloud, uploadImagesUser, uploadImagesExpert, deleteImage, uploadPaymentProof, uploadProfileUser, uploadProfileExpert } from "../controllers/UploadCloudinaryController.js";

const router = express.Router();

router.post('/upload', upload.array('files'), uploadFiles);
router.post('/upload-fish', uploadFishImage);
router.get('/uploads', getFiles);
router.delete('/delete-file', deleteFile);
router.post("/uploadclouduser", uploadcloud, uploadImagesUser);
router.post("/uploadcloudexpert", uploadcloud, uploadImagesExpert);
router.post("/uploadcloudpayment", uploadcloud, uploadPaymentProof);
router.post("/uploadcloudprofileuser", uploadcloud, uploadProfileUser);
router.post("/uploadcloudprofileexpert", uploadcloud, uploadProfileExpert);
router.delete("/delete", deleteImage);

export default router;
