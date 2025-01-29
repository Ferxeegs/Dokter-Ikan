import bcrypt from 'bcryptjs';
import User from "../models/UserModel.js";
import FishExperts from "../models/FishExpertsModel.js";
import jwt from 'jsonwebtoken';

// Fungsi login pengguna
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Mencari pengguna di tabel User terlebih dahulu
    let user = await User.findOne({ where: { email } });
    let role = 'user'; // Default role
    let userId = null; // Variabel untuk menyimpan ID pengguna

    if (!user) {
      // Jika tidak ditemukan di tabel User, cari di tabel FishExpert
      user = await FishExperts.findOne({ where: { email } });
      role = 'expert'; // Ubah role jika ditemukan di tabel FishExpert

      if (!user) {
        // Jika tidak ditemukan di kedua tabel
        return res.status(404).json({ message: 'Email atau password salah' });
      }

      userId = user.fishExperts_id; // Ambil ID dari tabel FishExperts
    } else {
      userId = user.user_id; // Ambil ID dari tabel User
    }

    // Memverifikasi apakah password cocok
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email atau password salah' });
    }

    // Membuat token JWT
    const token = jwt.sign(
      { id: userId, name: user.name, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Mengirimkan respons sukses dengan token
    res.status(200).json({
      message: 'Login berhasil',
      token,
      user: {
        id: userId, // Gunakan ID yang sesuai (user_id atau fishExperts_id)
        name: user.name,
        email: user.email,
        role,
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
    const user = await User.findByPk(req.params.id);  // Perbaiki 'user' menjadi 'User'
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

    // Jika password diberikan, enkripsi password baru
    let updatedData = { name, email, address, role };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);  // Hash password baru
    }

    await user.update(updatedData);

    res.status(200).json({ message: 'Pengguna berhasil diperbarui', user });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui pengguna', error });
  }
};



export const getMe = async (req, res) => {
  try {
    const { id: userId, role } = req.user; // Ambil ID dan role dari token
    console.log('User ID from token:', userId);
    console.log('Role from token:', role);

    if (role === 'expert') {
      // Jika role adalah 'expert', cari di tabel FishExperts
      console.log('Role is expert, looking in fishexperts...');
      const fishExpert = await FishExperts.findByPk(userId); // Mencari di tabel FishExperts
      if (!fishExpert) {
        return res.status(404).json({ message: 'Expert tidak ditemukan di fishexperts' });
      }
      return res.status(200).json({
        id: fishExpert.fishExperts_id,
        name: fishExpert.name,
        email: fishExpert.email,
        role: 'expert',
      });
    }

    // Jika role adalah 'user', cari di tabel Users
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan di users' });
    }
    return res.status(200).json({
      id: user.user_id,
      name: user.name,
      email: user.email,
      role: 'user',
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ message: 'Gagal mengambil data pengguna', error: error.message });
  }
};

