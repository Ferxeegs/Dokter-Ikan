import FishType from "../models/FishTypeModel.js"; // Import model FishType

// Fungsi untuk mendapatkan semua Fish Types
export const getAllFishTypes = async (req, res) => {
  try {
    const fishTypes = await FishType.findAll();
    res.status(200).json(fishTypes);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data jenis ikan", error });
  }
};

// Fungsi untuk mendapatkan Fish Type berdasarkan ID
export const getFishTypeById = async (req, res) => {
  try {
    const fishType = await FishType.findByPk(req.params.id);
    if (!fishType) {
      return res.status(404).json({ message: "Jenis ikan tidak ditemukan" });
    }
    res.status(200).json(fishType);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data jenis ikan", error });
  }
};

// Fungsi untuk mendapatkan Fish Type berdasarkan nama ikan
export const getFishTypeByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Nama ikan diperlukan" });
    }

    const fishType = await FishType.findOne({
      where: { name },
    });

    if (!fishType) {
      return res.status(404).json({ message: "Jenis ikan tidak ditemukan" });
    }

    res.status(200).json(fishType);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data jenis ikan", error });
  }
};
