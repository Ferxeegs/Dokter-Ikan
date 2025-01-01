'use client'; // Add this to mark the component as a Client Component

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';  // Import usePathname instead of useRouter

export default function Navbar() {
  const pathname = usePathname();  // Use usePathname to get the current path

  return (
    <nav className="flex items-center justify-between bg-white text-black font-bold p-4 sticky top-0 z-10">
      {/* Icon di sisi kiri */}
      <div className="flex items-center">
        <Image src="/icon512.png" alt="Home Icon" width={64} height={96} />
        <Image src="/icondokterikan.png" alt="Extra Icon" width={164} height={164} />
      </div>

      {/* Menu di tengah */}
      <div className="flex space-x-14 text-1xl font-semibold font-sans ml-40 -mr-8">
        <Link href="/">
          <span
            className={`hover:underline ${
              pathname === '/' ? 'text-[#1A83FB]' : ''
            }`}
          >
            Beranda
          </span>
        </Link>
        <Link href="/artikel">
          <span
            className={`hover:underline ${
              pathname === '/artikel' ? 'text-[#1A83FB]' : ''
            }`}
          >
            Artikel
          </span>
        </Link>
        <Link href="/riwayat">
          <span
            className={`hover:underline ${
              pathname === '/riwayat' ? 'text-[#1A83FB]' : ''
            }`}
          >
            Riwayat
          </span>
        </Link>
      </div>

      {/* Button Login */}
      <Link href="/login">
        <button
          className="bg-[#69CBF4] text-white px-6 py-1 rounded-lg hover:bg-[#4AABDE] transition text-1x1 font-sans font-semibold mr-8"
        >
          Login
        </button>
      </Link>
    </nav>
  );
}
