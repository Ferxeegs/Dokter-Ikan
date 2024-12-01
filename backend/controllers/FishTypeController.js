import FishType from "../models/FishTypeModel.js"; // Import model FishType

// Fungsi untuk mendapatkan semua Fish Types
export const getAllFishTypes = async (req, res) => {
  try {
    const fishTypes = await FishType.findAll();
    res.status(200).json(fishTypes);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data jenis ikan', error });
  }
};

// Fungsi untuk mendapatkan Fish Type berdasarkan ID
export const getFishTypeById = async (req, res) => {
  try {
    const fishType = await FishType.findByPk(req.params.id);
    if (!fishType) {
      return res.status(404).json({ message: 'Jenis ikan tidak ditemukan' });
    }
    res.status(200).json(fishType);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data jenis ikan', error });
  }
};

// Fungsi untuk menambahkan Fish Type baru
export const createFishType = async (req, res) => {
  try {
    const { name, description, habitat, image } = req.body;
    const newFishType = await FishType.create({ name, description, habitat, image });
    res.status(201).json({ message: 'Jenis ikan berhasil ditambahkan', newFishType });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan jenis ikan', error });
  }
};

// Fungsi untuk memperbarui data Fish Type
export const updateFishType = async (req, res) => {
  try {
    const fishType = await FishType.findByPk(req.params.id);
    if (!fishType) {
      return res.status(404).json({ message: 'Jenis ikan tidak ditemukan' });
    }

    const { name, description, habitat, image } = req.body;
    await fishType.update({ name, description, habitat, image });

    res.status(200).json({ message: 'Jenis ikan berhasil diperbarui', fishType });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui jenis ikan', error });
  }
};

// Fungsi untuk menghapus Fish Type
export const deleteFishType = async (req, res) => {
  try {
    const fishType = await FishType.findByPk(req.params.id);
    if (!fishType) {
      return res.status(404).json({ message: 'Jenis ikan tidak ditemukan' });
    }

    await fishType.destroy();
    res.status(200).json({ message: 'Jenis ikan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus jenis ikan', error });
  }
};
