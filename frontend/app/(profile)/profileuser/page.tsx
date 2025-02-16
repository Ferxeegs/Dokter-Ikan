'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import ProfileInfo from '@/app/components/profile/ProfileUserInfo';
import ChangePassword from '@/app/components/profile/ChangePassword';
import Image from 'next/image';

interface User {
  name: string;
  email: string;
  address: string;
  role: string;
  phone_number?: string;
  created_at?: string;
  image?: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
            setUser({
              ...data,
              created_at: new Date(data.created_at).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              }),
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <p className="text-center mt-10 text-gray-800">Loading...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 p-8">
        <div className="max-w-4xl w-full bg-white/30 backdrop-blur-lg shadow-2xl rounded-xl p-8 border border-white/40">
          <div className="relative flex items-center space-x-6">
            <div className="relative">
              <Image src={user.image || '/default-avatar.png'} alt="Profile Picture" width={96} height={96} className="rounded-full border-2 border-gray-300 shadow-md" unoptimized />
              <div className="absolute bottom-0 right-0 bg-blue-600 p-1 rounded-full cursor-pointer">
                <Image src="/images/icon/ic_foto.png" alt="Edit" width={16} height={16} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">{user.name}</h2>
          </div>

          <div className="mt-6 border-b border-gray-300 flex space-x-4">
            <button onClick={() => setActiveTab('info')} className={`py-2 font-semibold ${activeTab === 'info' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-600'}`}>
              Informasi Dasar
            </button>
            <button onClick={() => setActiveTab('password')} className={`py-2 font-semibold ${activeTab === 'password' ? 'border-b-2 border-gray-900 text-gray-900' : 'text-gray-600'}`}>
              Ganti Kata Sandi
            </button>
          </div>

          {activeTab === 'info' ? <ProfileInfo user={user} /> : <ChangePassword />}
        </div>
      </div>
      <Footer />
    </>
  );
}