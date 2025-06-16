'use client';

import { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import ProfileExpertInfo from '@/app/components/profile/ProfileExpertInfo';
import ChangePassword from '@/app/components/profile/ChangePassword';
import Image from 'next/image';

interface FishExpert {
  name: string;
  email: string;
  phone_number: string;
  specialization: string;
  experience: string;
  created_at?: string;
  image?: string;
}

export default function ProfileExpert() {
  const [fishExpert, setFishExpert] = useState<FishExpert | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
  const fetchExpertData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Gagal mengambil data ahli ikan.');
        return;
      }

      const data = await response.json();
      setFishExpert({
        ...data.data,
        created_at: new Date(data.data.created_at).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
      });
    } catch (error) {
      console.error('Error fetching expert data:', error);
    }
  };

  fetchExpertData();
}, [API_BASE_URL]);

// Buka file picker saat gambar diklik
const handleImageClick = () => {
  fileInputRef.current?.click();
};

const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('files', file);

  try {
    const uploadResponse = await fetch(`${API_BASE_URL}/uploadcloudprofileuser`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!uploadResponse.ok) {
      console.error('Upload gambar gagal.');
      return;
    }

    const uploadResult = await uploadResponse.json();
    const newImageUrl = uploadResult.data?.images?.[0]?.url;

    if (!newImageUrl) {
      console.error('URL gambar tidak ditemukan dalam respons.');
      return;
    }

    // Update di frontend
    setFishExpert((prev) => (prev ? { ...prev, image: newImageUrl } : prev));

    // Simpan ke database
    const updateResponse = await fetch(`${API_BASE_URL}/update-image-expert`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_url: newImageUrl }),
    });

    if (!updateResponse.ok) {
      console.error('Gagal menyimpan URL gambar ke database.');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
  }
};

  if (!fishExpert) {
    return <p className="text-center mt-10 text-gray-800">Loading...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 p-8">
        <div className="max-w-4xl w-full bg-white/30 backdrop-blur-lg shadow-2xl rounded-xl p-8 border border-white/40">
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 shadow-md">
                <Image
                  src={fishExpert.image || '/images/icon/ic_defaultprofil.svg'}
                  alt="Profile Picture"
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
              <div
                onClick={handleImageClick}
                className="absolute bottom-0 right-0 translate-x-1/5 translate-y-1/5 bg-blue-600 p-1 rounded-full cursor-pointer border-2 border-white"
              >
                <Image src="/images/icon/ic_foto.png" alt="Edit" width={16} height={16} />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">{fishExpert.name}</h2>
          </div>

          <div className="mt-6 border-b border-gray-300 flex space-x-4">
            <button onClick={() => setActiveTab('info')} className={`py-2 font-semibold ${activeTab === 'info' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-600'}`}>
              Informasi Dasar
            </button>
            <button onClick={() => setActiveTab('password')} className={`py-2 font-semibold ${activeTab === 'password' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-600'}`}>
              Ganti Kata Sandi
            </button>
          </div>

          {activeTab === 'info' ? <ProfileExpertInfo fishExpert={fishExpert} /> : <ChangePassword />}
        </div>
      </div>
      <Footer />
    </>
  );
}