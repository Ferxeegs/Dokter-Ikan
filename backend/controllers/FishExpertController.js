import FishExperts from "../models/FishExpertsModel.js";

// Mendapatkan semua data Fish Experts
export const getAllFishExperts = async (req, res) => {
  try {
    const experts = await FishExperts.findAll();
    res.status(200).json(experts);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data Fish Experts", error });
  }
};

// Mendapatkan Fish Expert berdasarkan ID
export const getFishExpertById = async (req, res) => {
  try {
    const expert = await FishExperts.findByPk(req.params.id);
    if (!expert) {
      return res.status(404).json({ message: "Fish Expert tidak ditemukan" });
    }
    res.status(200).json(expert);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data Fish Expert", error });
  }
};

// Menambahkan Fish Expert baru
export const createFishExpert = async (req, res) => {
  try {
    const { name, email, password, phone_number, specialization, experience } = req.body;

    const newExpert = await FishExperts.create({
      name,
      email,
      password, // Idealnya password dienkripsi sebelum disimpan
      phone_number,
      specialization,
      experience,
    });

    res.status(201).json({
      message: "Fish Expert berhasil ditambahkan",
      data: newExpert,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan Fish Expert", error });
  }
};

// Memperbarui data Fish Expert berdasarkan ID
export const updateFishExpert = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, phone_number, specialization, experience } = req.body;

    const expert = await FishExperts.findByPk(id);
    if (!expert) {
      return res.status(404).json({ message: "Fish Expert tidak ditemukan" });
    }

    await expert.update({
      name,
      email,
      password, // Idealnya password dienkripsi sebelum disimpan
      phone_number,
      specialization,
      experience,
    });

    res.status(200).json({
      message: "Fish Expert berhasil diperbarui",
      data: expert,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui Fish Expert", error });
  }
};

// Menghapus Fish Expert berdasarkan ID
export const deleteFishExpert = async (req, res) => {
  try {
    const { id } = req.params;

    const expert = await FishExperts.findByPk(id);
    if (!expert) {
      return res.status(404).json({ message: "Fish Expert tidak ditemukan" });
    }

    await expert.destroy();
    res.status(200).json({ message: "Fish Expert berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus Fish Expert", error });
  }
};
