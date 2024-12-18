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

// Fungsi untuk mendapatkan data penyakit ikan berdasarkan ID
export const getFishDiseaseById = async (req, res) => {
  try {
    const disease = await FishDisease.findByPk(req.params.id, {
      include: [
        {
          model: FishType,
          attributes: ['fish_type_id', 'name']
        }
      ]
    });
    if (!disease) {
      return res.status(404).json({ message: 'Data penyakit ikan tidak ditemukan' });
    }
    res.status(200).json(disease);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data penyakit ikan', error: error.message });
  }
};

// Fungsi untuk menambahkan data penyakit ikan
export const createFishDisease = async (req, res) => {
  try {
    const { fish_type_id, name_disease, symtomps, causes, treatment } = req.body;

    const newDisease = await FishDisease.create({
      fish_type_id,
      name_disease,
      symtomps,
      causes,
      treatment
    });

    res.status(201).json({
      message: 'Data penyakit ikan berhasil ditambahkan',
      data: newDisease
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan data penyakit ikan', error: error.message });
  }
};

// Fungsi untuk memperbarui data penyakit ikan berdasarkan ID
export const updateFishDisease = async (req, res) => {
  try {
    const { fish_type_id, name_disease, symtomps, causes, treatment } = req.body;

    const disease = await FishDisease.findByPk(req.params.id);
    if (!disease) {
      return res.status(404).json({ message: 'Data penyakit ikan tidak ditemukan' });
    }

    // Update data penyakit
    await disease.update({
      fish_type_id,
      name_disease,
      symtomps,
      causes,
      treatment
    });

    res.status(200).json({
      message: 'Data penyakit ikan berhasil diperbarui',
      data: disease
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui data penyakit ikan', error: error.message });
  }
};

// Fungsi untuk menghapus data penyakit ikan berdasarkan ID
export const deleteFishDisease = async (req, res) => {
  try {
    const disease = await FishDisease.findByPk(req.params.id);
    if (!disease) {
      return res.status(404).json({ message: 'Data penyakit ikan tidak ditemukan' });
    }

    // Hapus data penyakit
    await disease.destroy();
    res.status(200).json({ message: 'Data penyakit ikan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus data penyakit ikan', error: error.message });
  }
};
