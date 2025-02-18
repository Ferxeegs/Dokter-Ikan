import FishExperts from "../models/FishExpertsModel.js";
import bcrypt from 'bcryptjs';

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

    // Cek apakah email sudah terdaftar
    const existingExpert = await FishExperts.findOne({ where: { email } });
    if (existingExpert) {
      return res.status(400).json({ message: "Email sudah terdaftar" });
    }

    // Enkripsi password sebelum disimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10); // 10 adalah jumlah salt rounds

    // Membuat entri baru di tabel FishExperts
    const newExpert = await FishExperts.create({
      name,
      email,
      password: hashedPassword, // Simpan password yang sudah dienkripsi
      phone_number,
      specialization,
      experience,
      image_url
    });

    res.status(201).json({
      message: "Fish Expert berhasil ditambahkan",
      data: {
        id: newExpert.fishExperts_id,
        name: newExpert.name,
        email: newExpert.email,
        phone_number: newExpert.phone_number,
        specialization: newExpert.specialization,
        experience: newExpert.experience,
        image: newExpert.image_url,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menambahkan Fish Expert", error: error.message });
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
