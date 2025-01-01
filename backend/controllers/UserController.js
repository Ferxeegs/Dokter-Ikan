import bcrypt from 'bcryptjs';
import User from "../models/UserModel.js";
import jwt from 'jsonwebtoken';
// const User = require('../models/User.js'); // Import model User

// Fungsi untuk mendapatkan semua pengguna
// exports.getUsers = (req, res) => {
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Mencari pengguna berdasarkan email
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Jika pengguna tidak ditemukan
      return res.status(404).json({ message: 'Email atau password salah' });
    }

    // Memverifikasi apakah password cocok dengan yang ada di database
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      // Jika password tidak cocok
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    // Membuat token JWT (untuk autentikasi pengguna di frontend)
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET, // Gantilah dengan key yang aman
      { expiresIn: '1h' }
    );

    // Mengirimkan respons sukses dengan token
    res.status(200).json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat login', error: error.message });
  }
};
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

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      // Jika email sudah terdaftar, kirimkan pesan error
      return res.status(400).json({ message: 'Email sudah terdaftar' });
    }

    // Enkripsi password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10); // 10 adalah jumlah salt rounds

    // Jika email belum terdaftar, lanjutkan untuk membuat pengguna baru
    const newUser = await User.create({ 
      name, 
      email, 
      password: hashedPassword, // Menyimpan password yang terenkripsi
      address, 
      role 
    });

    // Kirimkan respons sukses jika berhasil membuat pengguna baru
    res.status(201).json({ message: 'Pengguna berhasil ditambahkan', newUser });
  } catch (error) {
    // Tangani error lain
    console.error(error);
    res.status(500).json({ message: 'Gagal menambahkan pengguna', error: error.message });
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
