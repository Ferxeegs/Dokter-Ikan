import express from "express";
import { sendMessage, getMessagesByConsultation, markMessagesAsRead } from "../controllers/ConsultationMessageController.js";

const router = express.Router();

router.post("/messages/send", sendMessage);
router.get("/messages/:consultation_id", getMessagesByConsultation);
router.put("/messages/read", markMessagesAsRead);

export default router;
