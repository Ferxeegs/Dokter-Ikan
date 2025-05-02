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
  const [menuOpen, setMenuOpen] = useState(false);
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
            setUser(data.data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [API_BASE_URL]);

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
        <div className="flex items-center gap-2 md:gap-4">
          <img
            src="/images/logo/logo_fdokterikan.png"
            alt="Home Icon"
            className="w-28 h-10 md:w-40 md:h-16"
          />
        </div>
      </Link>

      <div className="hidden md:flex space-x-8 text-sm sm:text-base font-semibold font-lato">
        <Link href={user?.role === 'expert' ? '/expertpage' : '/'}>
          <span className={`hover:underline ${(pathname === '/' || pathname === '/expertpage') ? 'text-[#1A83FB]' : ''}`}>Beranda</span>
        </Link>
        <Link href="/article">
          <span className={`hover:underline ${pathname === '/article' ? 'text-[#1A83FB]' : ''}`}>Artikel</span>
        </Link>
        <Link href={user?.role === 'expert' ? '/riwayatexpert' : '/riwayat'}>
          <span className={`hover:underline ${(pathname === '/riwayat' || pathname === '/riwayatexpert') ? 'text-[#1A83FB]' : ''}`}>Riwayat</span>
        </Link>
      </div>

      <div className="md:hidden flex items-center ml-auto">
        <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
          <Image src="/images/icon/ic_menu.png" alt="Menu Icon" width={20} height={20} />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg text-sm z-10 font-lato">
          <div className="flex flex-col items-center space-y-4 py-4">
            <Link href="/">
              <span className={`hover:underline ${pathname === '/' ? 'text-[#1A83FB]' : ''}`} onClick={() => setMenuOpen(false)}>Beranda</span>
            </Link>
            <Link href="/article">
              <span className={`hover:underline ${pathname === '/article' ? 'text-[#1A83FB]' : ''}`} onClick={() => setMenuOpen(false)}>Artikel</span>
            </Link>
            <Link href={user?.role === 'expert' ? '/riwayatexpert' : '/riwayat'}>
              <span className={`hover:underline ${(pathname === '/riwayat' || pathname === '/riwayatexpert') ? 'text-[#1A83FB]' : ''}`} onClick={() => setMenuOpen(false)}>Riwayat</span>
            </Link>
            {user ? (
              <>
                <Link href={user.role === 'expert' ? '/profile-expert' : '/profile-user'}>
                  <span className="block px-4 py-2 text-black text-sm hover:bg-gray-200 cursor-pointer" onClick={() => setMenuOpen(false)}>Profil</span>
                </Link>
                <button onClick={handleLogout} className="block w-full px-4 py-2 text-red-600 hover:bg-gray-200 cursor-pointer">Logout</button>
              </>
            ) : (
              <Link href="/login">
                <button className="bg-[#69CBF4] text-white px-6 py-1 rounded-lg hover:bg-[#4AABDE] transition text-l font-sans font-semibold" onClick={() => setMenuOpen(false)}>Login</button>
              </Link>
            )}
          </div>
        </div>
      )}

      {user ? (
        <div className="hidden md:flex relative items-center space-x-4" ref={dropdownRef}>
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
          <button className="hidden md:block bg-[#69CBF4] text-white px-6 py-1 rounded-lg hover:bg-[#4AABDE] transition text-lg font-sans font-semibold">Login</button>
        </Link>
      )}
    </nav>
  );
}