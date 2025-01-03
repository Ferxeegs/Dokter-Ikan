'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface User {
  name: string;
  email: string;
  id: number;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      console.log('Token yang digunakan:', token); // Tambahkan log untuk melihat token
      if (token) {
        try {
          const response = await fetch('http://localhost:9000/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            const errorData = await response.json();
            console.error('Error details:', errorData); // Log error untuk melihat pesan lebih lanjut
            alert(`Gagal mengambil data pengguna: ${errorData.message}`);
          }
          
        } catch (error) {
          console.error('Error fetching user data:', error);
          alert('Terjadi kesalahan saat mengambil data pengguna.');
        }
      }
    };
  
    fetchUserData();
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="flex items-center justify-between bg-white text-black font-bold p-4 sticky top-0 z-10">
      <div className="flex items-center">
        <Image src="/icon512.png" alt="Home Icon" width={64} height={96} />
        <Image src="/icondokterikan.png" alt="Extra Icon" width={164} height={164} />
      </div>

      <div className="flex space-x-14 text-1xl font-semibold font-sans ml-40 -mr-8">
        <Link href="/">
          <span
            className={`hover:underline ${pathname === '/' ? 'text-[#1A83FB]' : ''}`}
          >
            Beranda
          </span>
        </Link>
        <Link href="/artikel">
          <span
            className={`hover:underline ${pathname === '/artikel' ? 'text-[#1A83FB]' : ''}`}
          >
            Artikel
          </span>
        </Link>
        <Link href="/riwayat">
          <span
            className={`hover:underline ${pathname === '/riwayat' ? 'text-[#1A83FB]' : ''}`}
          >
            Riwayat
          </span>
        </Link>
      </div>

      {/* Menampilkan Nama Pengguna atau Tombol Login */}
      {user ? (
        <div className="flex items-center space-x-4 mr-8">
          <Image
            src="/ic_profile.png"
            alt="User Icon"
            width={30}
            height={30}
            className="rounded-full"
          />
          <span className="font-semibold">{user.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition text-sm"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link href="/login">
          <button
            className="bg-[#69CBF4] text-white px-6 py-1 rounded-lg hover:bg-[#4AABDE] transition text-1x1 font-sans font-semibold mr-8"
          >
            Login
          </button>
        </Link>
      )}
    </nav>
  );
}
