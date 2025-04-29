import FishExpertAnswer from "../models/FishExpertAnswerModel.js";
import "regenerator-runtime/runtime.js";

// Fungsi untuk mendapatkan semua jawaban dari ahli ikan
export const getAllFishExpertAnswers = async (req, res) => {
  try {
    const answers = await FishExpertAnswer.findAll();
    return res.success('Berhasil mengambil data jawaban ahli ikan', answers);
  } catch (error) {
    console.error('Error getting fish expert answers:', error);
    return res.fail('Gagal mengambil data jawaban ahli ikan', error.message, 500);
  }
};

// Fungsi untuk mendapatkan jawaban berdasarkan ID
export const getFishExpertAnswerById = async (req, res) => {
  try {
    const answer = await FishExpertAnswer.findByPk(req.params.id);
    if (!answer) {
      return res.fail('Jawaban tidak ditemukan', null, 404);
    }
    return res.success('Berhasil mengambil data jawaban ahli ikan', answer);
  } catch (error) {
    console.error('Error getting fish expert answer by ID:', error);
    return res.fail('Gagal mengambil data jawaban ahli ikan', error.message, 500);
  }
};

// Fungsi untuk menambahkan jawaban baru
export const createFishExpertAnswer = async (req, res) => {
  try {
    const { fishExpert_id, answer, timestamp, image } = req.body; // Menambahkan image ke dalam request body

    // Validasi input (image opsional, tidak wajib)
    if (!fishExpert_id || !answer || !timestamp) {
      return res.fail('Data tidak lengkap. fishExpert_id, answer, dan timestamp wajib diisi');
    }

    // Menyimpan jawaban ke database
    const newAnswer = await FishExpertAnswer.create({
      fishExpert_id,
      answer,
      timestamp,
      image: image || null, // Jika tidak ada image, disimpan sebagai NULL
    });

    return res.success('Jawaban ahli ikan berhasil dibuat', newAnswer);
  } catch (error) {
    console.error('Error creating fish expert answer:', error);
    return res.fail('Terjadi kesalahan pada server', error.message, 500);
  }
};

// Fungsi untuk memperbarui jawaban berdasarkan ID
export const updateFishExpertAnswer = async (req, res) => {
  try {
    const answer = await FishExpertAnswer.findByPk(req.params.id);
    if (!answer) {
      return res.fail('Jawaban tidak ditemukan', null, 404);
    }

    const { answer: updatedAnswer, timestamp, consultation_status } = req.body;
    await answer.update({ 
      answer: updatedAnswer, 
      timestamp, 
      consultation_status 
    });

    return res.success('Jawaban ahli ikan berhasil diperbarui', answer);
  } catch (error) {
    console.error('Error updating fish expert answer:', error);
    return res.fail('Gagal memperbarui jawaban', error.message, 500);
  }
};

// Fungsi untuk menghapus jawaban berdasarkan ID
export const deleteFishExpertAnswer = async (req, res) => {
  try {
    const answer = await FishExpertAnswer.findByPk(req.params.id);
    if (!answer) {
      return res.fail('Jawaban tidak ditemukan', null, 404);
    }

    await answer.destroy();
    return res.success('Jawaban ahli ikan berhasil dihapus');
  } catch (error) {
    console.error('Error deleting fish expert answer:', error);
    return res.fail('Gagal menghapus jawaban', error.message, 500);
  }
};