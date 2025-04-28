import FishExperts from "../models/FishExpertsModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import "regenerator-runtime/runtime.js";

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


export const updateFishExpertPassword = async (req, res) => {
  try {
    // Ambil fishExpert ID dari token
    const fishExpertId = req.user.id;

    // Ambil data dari request body
    const { currentPassword, newPassword } = req.body;

    // Validasi input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Semua kolom harus diisi." });
    }

    // Ambil data fishExpert dari database
    const fishExpert = await FishExperts.findByPk(fishExpertId);
    if (!fishExpert) {
      return res.status(404).json({ message: "Fish Expert tidak ditemukan." });
    }

    // Pastikan password lama yang disimpan di database ada
    if (!fishExpert.password) {
      return res.status(500).json({ message: "Password lama tidak ditemukan di database." });
    }

    // Cek apakah password lama cocok
    const isMatch = await bcrypt.compare(currentPassword, fishExpert.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Kata sandi saat ini salah." });
    }

    // Hash password baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Simpan password baru ke database
    fishExpert.password = hashedPassword;
    await fishExpert.save();

    res.json({ message: "Kata sandi berhasil diperbarui." });
  } catch (error) {
    console.error("Error updating fish expert password:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};


export const updateProfileExpert = async (req, res) => {
  try {
    const fishExpertId = req.user.id; // Asumsikan user ID disimpan di req.user setelah autentikasi
    const { name, phone_number, specialization, experience } = req.body;

    const user = await FishExperts.findByPk(fishExpertId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.phone_number = phone_number || user.phone_number;
    user.specialization = specialization || user.specialization;
    user.experience = experience || user.experience;

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // atau SECRET yang kamu pakai
    const fishExpertId = decoded.id;

    const { image_url } = req.body;

    await FishExperts.update({ image_url }, { where: { fishExperts_id: fishExpertId } });

    res.json({ message: "Profile picture updated successfully!" });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ error: error.message });
  }
};