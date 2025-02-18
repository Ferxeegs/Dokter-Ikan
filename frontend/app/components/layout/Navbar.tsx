'use client'

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  name: string;
  email: string;
  id: number;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = () => {
    Cookies.remove('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <nav className="flex items-center justify-between bg-white text-black font-bold p-4 sticky top-0 z-10">
      <Link href="/">
        <div className="flex items-center">
          <Image src="/images/logo/logo_dokterikan512.png" alt="Home Icon" width={64} height={96} />
          <Image src="/images/logo/logo_dokterikan.png" alt="Extra Icon" width={164} height={164} />
        </div>
      </Link>

      <div className="flex space-x-14 text-1xl font-semibold font-sans ml-40 -mr-8">
        <Link href="/">
          <span className={`hover:underline ${pathname === '/' ? 'text-[#1A83FB]' : ''}`}>Beranda</span>
        </Link>
        <Link href="/article">
          <span className={`hover:underline ${pathname === '/article' ? 'text-[#1A83FB]' : ''}`}>Artikel</span>
        </Link>
        <Link href={user?.role === 'expert' ? '/riwayatexpert' : '/riwayat'}>
          <span className={`hover:underline ${(pathname === '/riwayat' || pathname === '/riwayatexpert') ? 'text-[#1A83FB]' : ''}`}>Riwayat</span>
        </Link>
      </div>

      {user ? (
        <div className="relative flex items-center space-x-4 mr-8" ref={dropdownRef}>
          <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2 focus:outline-none relative">
            <Image src="/images/icon/ic_profile.png" alt="User Icon" width={30} height={30} className="rounded-full" />
            <span className="font-semibold">{user.name}</span>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-36 w-48 bg-white border rounded-lg shadow-lg py-2">
              <Link href={user.role === 'expert' ? '/profile-expert' : '/profile-user'}>
                <span className="block px-4 py-2 text-black hover:bg-gray-200 cursor-pointer">Profil</span>
              </Link>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200 cursor-pointer">Logout</button>
            </div>
          )}
        </div>
      ) : (
        <Link href="/login">
          <button className="bg-[#69CBF4] text-white px-6 py-1 rounded-lg hover:bg-[#4AABDE] transition text-1x1 font-sans font-semibold mr-8">Login</button>
        </Link>
      )}
    </nav>
  );
}