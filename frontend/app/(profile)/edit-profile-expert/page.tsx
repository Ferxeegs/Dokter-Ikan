'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import NotificationModal from '@/app/components/modals/ModalUpdateProfile';

interface User {
  name: string;
  email: string;
  specialization?: string;
  experience?: string;
  phone_number?: string;
}

export default function EditProfile() {
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    specialization: '',
    experience: '',
    phone_number: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setFormData(data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [API_BASE_URL]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = Cookies.get('token');

    try {
      const response = await fetch(`${API_BASE_URL}/update-profile-expert`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setModalMessage('Profil berhasil diperbarui!');
        setIsModalOpen(true);
        setTimeout(() => {
          setIsModalOpen(false);
          router.push('/profile-expert');
        }, 2000);
      } else {
        const errorData = await response.json();
        setModalMessage(`Gagal memperbarui profil: ${errorData.message}`);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setModalMessage('Terjadi kesalahan saat memperbarui profil.');
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 p-8">
        <div className="max-w-4xl w-full bg-white/30 backdrop-blur-lg shadow-2xl rounded-xl p-8 border border-white/40">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Edit Profil</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-900 font-semibold mb-2">Nama</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 text-gray-700 border rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-900 font-semibold mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                className="w-full p-2 text-gray-700 border rounded-lg bg-gray-200"
                disabled
              />
            </div>
            <div>
              <label htmlFor="phone_number" className="block text-gray-900 font-semibold mb-2">Nomor Telepon</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number || ''}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                className="w-full p-2 text-gray-700 border rounded-lg"
                placeholder="Masukkan nomor telepon"
                required
              />
            </div>
            <div>
              <label htmlFor="specialization" className="block text-gray-900 font-semibold mb-2">Spesialisasi</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization || ''}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="w-full p-2 text-gray-700 border rounded-lg"
                placeholder="Masukkan spesialisasi"
                required
              />
            </div>
            <div>
              <label htmlFor="experience" className="block text-gray-900 font-semibold mb-2">Pengalaman</label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience || ''}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="w-full p-2 text-gray-700 border rounded-lg"
                placeholder="Masukkan pengalaman"
                rows={4}
                required
              />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg">
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <NotificationModal
        isOpen={isModalOpen}
        message={modalMessage}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}