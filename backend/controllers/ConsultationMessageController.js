import ConsultationMessage from "../models/ConsultationMessageModel.js";
import Consultation from "../models/ConsultationModel.js";
import "regenerator-runtime/runtime.js";

// Kirim pesan dalam konsultasi
export const sendMessage = async (req, res) => {
    try {
        const { consultation_id, sender_role, message } = req.body;

        // Pastikan sender_role valid
        if (!["user", "expert"].includes(sender_role)) {
            return res.fail("Sender role tidak valid");
        }

        // Periksa apakah konsultasi ada
        const consultation = await Consultation.findByPk(consultation_id);
        if (!consultation) {
            return res.fail("Konsultasi tidak ditemukan", null, 404);
        }

        // Simpan pesan ke database
        const newMessage = await ConsultationMessage.create({
            consultation_id,
            sender_role,
            message
        });

        return res.success("Pesan berhasil dikirim", newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        return res.fail("Gagal mengirim pesan", error.message, 500);
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

        return res.success("Berhasil mengambil pesan", messages);
    } catch (error) {
        console.error("Error retrieving messages:", error);
        return res.fail("Gagal mengambil pesan", error.message, 500);
    }
};

// Tandai pesan sebagai telah dibaca
export const markMessagesAsRead = async (req, res) => {
    try {
        const { consultation_id } = req.body;

        // Memastikan consultation_id ada
        if (!consultation_id) {
            return res.fail("ID konsultasi diperlukan");
        }

        const result = await ConsultationMessage.update(
            { is_read: true },
            { where: { consultation_id } }
        );

        // Jika tidak ada pesan yang diperbarui
        if (result[0] === 0) {
            return res.success("Tidak ada pesan yang perlu ditandai");
        }

        return res.success("Pesan berhasil ditandai sebagai dibaca", { updatedCount: result[0] });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        return res.fail("Gagal menandai pesan sebagai dibaca", error.message, 500);
    }
};