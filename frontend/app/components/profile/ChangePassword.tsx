'use client';

import { useState } from 'react';
import Cookies from 'js-cookie';
import { Eye, EyeOff } from 'lucide-react';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState<{ current: boolean; new: boolean; confirm: boolean }>({
    current: false,
    new: false,
    confirm: false,
  });

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleChangePassword = async () => {
    setMessage('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('Semua kolom harus diisi!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      // Ambil role user dari backend (bukan dari token di frontend)
      const roleResponse = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!roleResponse.ok) {
        throw new Error('Gagal mendapatkan data pengguna. Silakan login ulang.');
      }

      const userData = await roleResponse.json();
      const role = userData.data.role;

      const endpoint = role === 'expert' ? 'update-expert-password' : 'update-password';

      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengubah kata sandi.');
      }

      setMessage('Kata sandi berhasil diubah!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('Terjadi kesalahan.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="space-y-6 mt-6">
      {message && (
        <p className={`text-sm text-center ${message.includes('berhasil') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <div className="space-y-4">
        {/* Input Kata Sandi Sekarang */}
        <div className="relative">
          <label className="block text-gray-900 font-semibold">Kata Sandi Sekarang</label>
          <input
            type={showPassword.current ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-2 text-gray-900 border rounded-lg bg-white/50 backdrop-blur-md pr-10"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('current')}
            className="absolute right-3 top-9 text-gray-500"
          >
            {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Input Kata Sandi Baru */}
        <div className="relative">
          <label className="block text-gray-900 font-semibold">Kata Sandi Baru</label>
          <input
            type={showPassword.new ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 text-gray-900 border rounded-lg bg-white/50 backdrop-blur-md pr-10"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('new')}
            className="absolute right-3 top-9 text-gray-500"
          >
            {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Input Konfirmasi Kata Sandi Baru */}
        <div className="relative">
          <label className="block text-gray-900 font-semibold">Konfirmasi Kata Sandi Baru</label>
          <input
            type={showPassword.confirm ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 text-gray-900 border rounded-lg bg-white/50 backdrop-blur-md pr-10"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirm')}
            className="absolute right-3 top-9 text-gray-500"
          >
            {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="mt-6 text-right">
        <button
          onClick={handleChangePassword}
          className={`bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Mengubah...' : 'Ubah Kata Sandi'}
        </button>
      </div>
    </div>
  );
}