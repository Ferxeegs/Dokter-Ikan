import User from "../models/UserModel.js";
// const User = require('../models/User.js'); // Import model User

// Fungsi untuk mendapatkan semua pengguna
// exports.getUsers = (req, res) => {

// }
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pengguna', error });
  }
};

// Fungsi untuk mendapatkan pengguna berdasarkan ID
export const getUserById = async (req, res) => {
  try {
    const user = await user.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pengguna', error });
  }
};

// Fungsi untuk menambahkan pengguna baru
export const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    const newUser = await User.create({ name, email, password, address, role });
    res.status(201).json({ message: 'Pengguna berhasil ditambahkan', newUser });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan pengguna', error });
  }
};

// Fungsi untuk memperbarui data pengguna
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    const { name, email, password, address, role } = req.body;
    await user.update({ name, email, password, address, role });

    res.status(200).json({ message: 'Pengguna berhasil diperbarui', user });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui pengguna', error });
  }
};

// Fungsi untuk menghapus pengguna
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    await user.destroy();
    res.status(200).json({ message: 'Pengguna berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus pengguna', error });
  }
};
