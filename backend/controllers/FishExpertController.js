import FishExpert from "../models/FishExpertModel.js";  // Import model FishExpert

// Fungsi untuk mendapatkan semua data Fish Expert
export const getAllFishExperts = async (req, res) => {
  try {
    const fishExperts = await FishExpert.findAll();
    res.status(200).json(fishExperts);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data fish expert', error });
  }
};

// Fungsi untuk mendapatkan Fish Expert berdasarkan ID
export const getFishExpertById = async (req, res) => {
  try {
    const fishExpert = await FishExpert.findByPk(req.params.id);
    if (!fishExpert) {
      return res.status(404).json({ message: 'Fish expert tidak ditemukan' });
    }
    res.status(200).json(fishExpert);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data fish expert', error });
  }
};

// Fungsi untuk menambahkan Fish Expert baru
export const createFishExpert = async (req, res) => {
  try {
    const { name, expertise, experience_years, contact_info } = req.body;
    const newFishExpert = await FishExpert.create({ name, expertise, experience_years, contact_info });
    res.status(201).json({ message: 'Fish expert berhasil ditambahkan', newFishExpert });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan fish expert', error });
  }
};

// Fungsi untuk memperbarui data Fish Expert
export const updateFishExpert = async (req, res) => {
  try {
    const fishExpert = await FishExpert.findByPk(req.params.id);
    if (!fishExpert) {
      return res.status(404).json({ message: 'Fish expert tidak ditemukan' });
    }

    const { name, expertise, experience_years, contact_info } = req.body;
    await fishExpert.update({ name, expertise, experience_years, contact_info });

    res.status(200).json({ message: 'Fish expert berhasil diperbarui', fishExpert });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui fish expert', error });
  }
};

// Fungsi untuk menghapus Fish Expert
export const deleteFishExpert = async (req, res) => {
  try {
    const fishExpert = await FishExpert.findByPk(req.params.id);
    if (!fishExpert) {
      return res.status(404).json({ message: 'Fish expert tidak ditemukan' });
    }

    await fishExpert.destroy();
    res.status(200).json({ message: 'Fish expert berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus fish expert', error });
  }
};
