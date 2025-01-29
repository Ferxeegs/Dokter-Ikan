import FishDisease from "../models/FishDiseaseModel.js";
import FishType from "../models/FishTypeModel.js";

// Fungsi untuk mendapatkan semua data penyakit ikan
export const getAllFishDiseases = async (req, res) => {
  try {
    const diseases = await FishDisease.findAll({
      include: [
        {
          model: FishType,
          attributes: ['fish_type_id', 'name'] // Atribut yang ingin ditampilkan dari FishType
        }
      ]
    });
    res.status(200).json(diseases);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data penyakit ikan', error: error.message });
  }
};

