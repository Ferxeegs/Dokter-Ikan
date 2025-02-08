import ConsultationMessage from "../models/ConsultationMessageModel.js";
import Consultation from "../models/ConsultationModel.js";

// Kirim pesan dalam konsultasi
export const sendMessage = async (req, res) => {
    try {
        const { consultation_id, sender_role, message } = req.body;

        // Pastikan sender_role valid
        if (!["user", "expert"].includes(sender_role)) {
            return res.status(400).json({ message: "Invalid sender role" });
        }

        // Periksa apakah konsultasi ada
        const consultation = await Consultation.findByPk(consultation_id);
        if (!consultation) {
            return res.status(404).json({ message: "Consultation not found" });
        }

        // Simpan pesan ke database
        const newMessage = await ConsultationMessage.create({
            consultation_id,
            sender_role,
            message
        });

        res.status(201).json({
            message: "Message sent successfully",
            data: newMessage
        });
    } catch (error) {
        res.status(500).json({ message: "Error sending message", error: error.message });
    }
};

// Ambil semua pesan dalam satu konsultasi (untuk user & expert)
export const getMessagesByConsultation = async (req, res) => {
    try {
        const { consultation_id } = req.params;

        const messages = await ConsultationMessage.findAll({
            where: { consultation_id },
            order: [["created_at", "ASC"]] // Urutkan berdasarkan waktu
        });

        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving messages", error: error.message });
    }
};

// Tandai pesan sebagai telah dibaca
export const markMessagesAsRead = async (req, res) => {
    try {
        const { consultation_id } = req.body;

        await ConsultationMessage.update(
            { is_read: true },
            { where: { consultation_id } }
        );

        res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Error updating messages", error: error.message });
    }
};
