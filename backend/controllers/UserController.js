import bcrypt from 'bcryptjs';
import User from "../models/UserModel.js";
import FishExperts from "../models/FishExpertsModel.js";
import jwt from 'jsonwebtoken';
import "regenerator-runtime/runtime.js";

// Fungsi login pengguna
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ where: { email } });
    let role = 'user';
    let userId = null;

    if (!user) {
      user = await FishExperts.findOne({ where: { email } });
      role = 'expert';

      if (!user) {
        return res.fail('Email atau password salah', null, 404);
      }

      userId = user.fishExperts_id;
    } else {
      userId = user.user_id;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.fail('Email atau password salah');
    }

    const token = jwt.sign(
      { id: userId, name: user.name, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'None' : 'Lax',
      domain: isProduction ? '.dokterikan.com' : undefined,
      path: '/',
      maxAge: 3600000,
    });

    return res.success('Login berhasil', {
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.fail('Terjadi kesalahan saat login', error.message, 500);
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.success('Data pengguna berhasil diambil', users);
  } catch (error) {
    return res.fail('Gagal mengambil data pengguna', error.message, 500);
  }
};

// Fungsi untuk mendapatkan pengguna berdasarkan ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.fail('Pengguna tidak ditemukan', null, 404);
    }
    return res.success('Data pengguna berhasil diambil', user);
  } catch (error) {
    return res.fail('Gagal mengambil data pengguna', error.message, 500);
  }
};

// Fungsi untuk memperbarui data pengguna
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.fail('Pengguna tidak ditemukan', null, 404);
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

    return res.success('Pengguna berhasil diperbarui', user);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.fail('Gagal memperbarui pengguna', error.message, 500);
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
        return res.fail('Expert tidak ditemukan di fishexperts', null, 404);
      }

      const expertData = {
        id: fishExpert.fishExperts_id,
        name: fishExpert.name,
        email: fishExpert.email,
        phone_number: fishExpert.phone_number,
        specialization: fishExpert.specialization,
        experience: fishExpert.experience,
        created_at: fishExpert.created_at,
        image: fishExpert.image_url,
        role: 'expert',
      };

      return res.success('Data expert berhasil diambil', expertData);
    }

    // Jika role adalah 'user', cari di tabel Users
    const user = await User.findByPk(userId);
    if (!user) {
      return res.fail('Pengguna tidak ditemukan di users', null, 404);
    }

    const userData = {
      id: user.user_id,
      name: user.name,
      email: user.email,
      phone_number: user.phone_number,
      address: user.address,
      image: user.image,
      created_at: user.created_at,
      role: 'user',
    };

    return res.success('Data pengguna berhasil diambil', userData);
  } catch (error) {
    console.error('Error in getMe:', error);
    return res.fail('Gagal mengambil data pengguna', error.message, 500);
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
      return res.fail("Semua kolom harus diisi.");
    }

    // Ambil data user dari database
    const user = await User.findByPk(userId);
    if (!user) {
      return res.fail("User tidak ditemukan.", null, 404);
    }

    // Pastikan password lama yang dimasukkan tidak undefined
    if (!user.password) {
      return res.fail("Password lama tidak ditemukan di database.", null, 500);
    }

    // Cek apakah password lama cocok
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.fail("Kata sandi saat ini salah.");
    }

    // Hash password baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Simpan password baru ke database
    user.password = hashedPassword;
    await user.save();

    return res.success("Kata sandi berhasil diperbarui.");
  } catch (error) {
    console.error("Error updating password:", error);
    return res.fail("Terjadi kesalahan pada server.", error.message, 500);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Asumsikan user ID disimpan di req.user setelah autentikasi
    const { name, address, province, city, district, village, phone_number, image } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.fail('User tidak ditemukan', null, 404);
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

    return res.success('Profil berhasil diperbarui', user);
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.fail('Terjadi kesalahan server', error.message, 500);
  }
};

export const updateProfileImage = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // atau SECRET yang kamu pakai
    const userId = decoded.id; // Pastikan token bawa id user

    const { image } = req.body;

    await User.update({ image }, { where: { user_id: userId } });

    return res.success("Foto profil berhasil diperbarui");
  } catch (error) {
    console.error("Error updating profile image:", error);
    return res.fail("Gagal memperbarui foto profil", error.message, 500);
  }
};