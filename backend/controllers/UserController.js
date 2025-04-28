import bcrypt from 'bcryptjs';
import User from "../models/UserModel.js";
import FishExperts from "../models/FishExpertsModel.js";
import jwt from 'jsonwebtoken';
import "regenerator-runtime/runtime.js";

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

    const { name, email, password, address, province, city, district, village, phone_number, image, role } = req.body;

    // Membuat objek update data
    let updatedData = { name, email, address, province, city, district, village, phone_number, image, role };

    // Jika password diberikan, enkripsi password baru
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    // Update data user
    await user.update(updatedData);

    res.status(200).json({ message: 'Pengguna berhasil diperbarui', user });
  } catch (error) {
    console.error('Error updating user:', error);
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
        phone_number: fishExpert.phone_number,
        specialization: fishExpert.specialization,
        experience: fishExpert.experience,
        created_at: fishExpert.created_at,
        image: fishExpert.image_url,
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
      phone_number: user.phone_number,
      address: user.address,
      image: user.image,
      created_at: user.created_at,
      role: 'user',
    });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ message: 'Gagal mengambil data pengguna', error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    // Ambil user ID dari token
    const userId = req.user.id; 

    // Ambil data dari request body
    const { currentPassword, newPassword } = req.body;

    // Validasi input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Semua kolom harus diisi." });
    }

    // Ambil data user dari database
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }

    // Pastikan password lama yang dimasukkan tidak undefined
    if (!user.password) {
      return res.status(500).json({ message: "Password lama tidak ditemukan di database." });
    }

    // Cek apakah password lama cocok
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Kata sandi saat ini salah." });
    }

    // Hash password baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Simpan password baru ke database
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Kata sandi berhasil diperbarui." });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Asumsikan user ID disimpan di req.user setelah autentikasi
    const { name, address, province, city, district, village, phone_number, image } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.address = address || user.address;
    user.province = province || user.province;
    user.city = city || user.city;
    user.district = district || user.district;
    user.village = village || user.village;
    user.phone_number = phone_number || user.phone_number;
    user.image = image || user.image;

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
    const userId = decoded.id; // Pastikan token bawa id user

    const { image } = req.body;

    await User.update({ image }, { where: { user_id: userId } });

    res.json({ message: "Profile picture updated successfully!" });
  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ error: error.message });
  }
};