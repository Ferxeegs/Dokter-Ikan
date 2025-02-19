'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';

interface User {
  name: string;
  email: string;
  address: string;
  province?: string;
  city?: string;
  district?: string;
  village?: string;
  phone_number?: string;
  image?: string;
}

interface Region {
  id: string;
  name: string;
}

export default function EditProfile() {
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    address: '',
    province: '',
    city: '',
    district: '',
    village: '',
    phone_number: '',
  });
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const API_KEY = '35556323781a23d5a2b2bd1841f1eaf31f339f44c877fbae8c5f42dc6f19ddf8';
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

    const fetchProvinces = async () => {
      try {
        const response = await fetch(`https://api.binderbyte.com/wilayah/provinsi?api_key=${API_KEY}`);
        const data = await response.json();
        setProvinces(data.value as Region[]);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };

    fetchUserData();
    fetchProvinces();
  }, [API_BASE_URL]);

  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setFormData({ ...formData, province: id, city: '', district: '', village: '' });
    
    try {
      const response = await fetch(`https://api.binderbyte.com/wilayah/kabupaten?api_key=${API_KEY}&id_provinsi=${id}`);
      const data = await response.json();
      setCities(data.value as Region[]);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setFormData({ ...formData, city: id, district: '', village: '' });

    try {
      const response = await fetch(`https://api.binderbyte.com/wilayah/kecamatan?api_key=${API_KEY}&id_kabupaten=${id}`);
      const data = await response.json();
      setDistricts(data.value as Region[]);
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setFormData({ ...formData, district: id, village: '' });

    try {
      const response = await fetch(`https://api.binderbyte.com/wilayah/kelurahan?api_key=${API_KEY}&id_kecamatan=${id}`);
      const data = await response.json();
      setVillages(data.value as Region[]);
    } catch (error) {
      console.error('Error fetching villages:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = Cookies.get('token');

    try {
      const response = await fetch(`${API_BASE_URL}/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Profil berhasil diperbarui!');
        router.push('/profile');
      } else {
        alert('Gagal memperbarui profil.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
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
              <label htmlFor="province" className="block text-gray-900 font-semibold mb-2">Provinsi</label>
              <select
                id="province"
                onChange={handleProvinceChange}
                className="w-full p-2 text-gray-700 border rounded-lg"
                value={formData.province || ''}
              >
                <option value="">Pilih Provinsi</option>
                {provinces.map((prov) => (
                  <option key={prov.id} value={prov.id}>{prov.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="city" className="block text-gray-900 font-semibold mb-2">Kabupaten/Kota</label>
              <select
                id="city"
                onChange={handleCityChange}
                className="w-full p-2 text-gray-700 border rounded-lg"
                value={formData.city || ''}
              >
                <option value="">Pilih Kabupaten/Kota</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>{city.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="district" className="block text-gray-900 font-semibold mb-2">Kecamatan</label>
              <select
                id="district"
                onChange={handleDistrictChange}
                className="w-full p-2 text-gray-700 border rounded-lg"
                value={formData.district || ''}
              >
                <option value="">Pilih Kecamatan</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>{district.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="village" className="block text-gray-900 font-semibold mb-2">Kelurahan/Desa</label>
              <select
                id="village"
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full p-2 text-gray-700 border rounded-lg"
                value={formData.village || ''}
              >
                <option value="">Pilih Kelurahan/Desa</option>
                {villages.map((village) => (
                  <option key={village.id} value={village.id}>{village.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-900 font-semibold mb-2">Detail Alamat</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2 text-gray-700 border rounded-lg"
                placeholder="Nama jalan, nomor rumah, dll."
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
    </>
  );
}