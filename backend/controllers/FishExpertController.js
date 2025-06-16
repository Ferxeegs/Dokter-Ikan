import FishExperts from "../models/FishExpertsModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import "regenerator-runtime/runtime.js";

// Mendapatkan semua data Fish Experts
export const getAllFishExperts = async (req, res) => {
  try {
    const experts = await FishExperts.findAll();
    return res.success("Berhasil mengambil data Fish Experts", experts);
  } catch (error) {
    return res.fail("Gagal mengambil data Fish Experts", error, 500);
  }
};

// Mendapatkan Fish Expert berdasarkan ID
export const getFishExpertById = async (req, res) => {
  try {
    const expert = await FishExperts.findByPk(req.params.id);
    if (!expert) {
      return res.fail("Fish Expert tidak ditemukan", null, 404);
    }
    return res.success("Berhasil mengambil data Fish Expert", expert);
  } catch (error) {
    return res.fail("Gagal mengambil data Fish Expert", error, 500);
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
      return res.fail("Semua kolom harus diisi.");
    }

    // Ambil data fishExpert dari database
    const fishExpert = await FishExperts.findByPk(fishExpertId);
    if (!fishExpert) {
      return res.fail("Fish Expert tidak ditemukan.", null, 404);
    }

    // Pastikan password lama yang disimpan di database ada
    if (!fishExpert.password) {
      return res.fail("Password lama tidak ditemukan di database.", null, 500);
    }

    // Cek apakah password lama cocok
    const isMatch = await bcrypt.compare(currentPassword, fishExpert.password);
    if (!isMatch) {
      return res.fail("Kata sandi saat ini salah.");
    }

    // Hash password baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Simpan password baru ke database
    fishExpert.password = hashedPassword;
    await fishExpert.save();

    return res.success("Kata sandi berhasil diperbarui.");
  } catch (error) {
    console.error("Error updating fish expert password:", error);
    return res.fail("Terjadi kesalahan pada server.", error, 500);
  }
};

export const updateProfileExpert = async (req, res) => {
  try {
    const fishExpertId = req.user.id; // Asumsikan user ID disimpan di req.user setelah autentikasi
    const { name, phone_number, specialization, experience } = req.body;

    const user = await FishExperts.findByPk(fishExpertId);

    if (!user) {
      return res.fail('User not found', null, 404);
    }

    user.name = name || user.name;
    user.phone_number = phone_number || user.phone_number;
    user.specialization = specialization || user.specialization;
    user.experience = experience || user.experience;

    await user.save();

    return res.success('Profile updated successfully', user);
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.fail('Server error', error, 500);
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    const token = req.cookies.token; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // atau SECRET yang kamu pakai
    const fishExpertId = decoded.id;

    const { image_url } = req.body;

    await FishExperts.update({ image_url }, { where: { fishExperts_id: fishExpertId } });

    return res.success("Profile picture updated successfully!");
  } catch (error) {
    console.error("Error updating profile image:", error);
    return res.fail("Error updating profile image", error.message, 500);
  }
};