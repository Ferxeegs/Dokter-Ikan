import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-white text-black font-bold p-4 sticky top-0 z-10">
      {/* Icon di sisi kiri */}
      <div className="flex items-center">
        <Image src="/icon512.png" alt="Home Icon" width={64} height={96} />
        <Image src="/icondokterikan.png" alt="Extra Icon" width={164} height={164} />
      </div>

      {/* Menu di tengah */}
      <div className="flex space-x-14 text-1xl font-semibold font-sans ml-40 -mr-8">
        <a href="/" className="hover:underline">Beranda</a>
        <a href="/artikel" className="hover:underline">Artikel</a>
        <a href="/riwayat" className="hover:underline">Riwayat</a>
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
