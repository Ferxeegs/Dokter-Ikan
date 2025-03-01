import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white p-6 text-center font-sans">
      <div className="bg-[rgba(105,203,244,0.26)] p-8 rounded-lg shadow-lg mx-4">
        <div className="flex flex-col items-start md:flex-row md:items-start md:ml-16">
          <div className="flex items-center md:mb-0 ml-[-4px] md:ml-[-20px]">
            <Image src="/images/logo/logo_fdokterikan.png" alt="Home Icon" width={96} height={64} className="w-28 h-10 md:w-40 md:h-16" />
          </div>
        </div>

        {/* Kolom Teks */}
        <div className="flex flex-col md:flex-row md:justify-center md:gap-20 lg:gap-60 mb-4">
          <div className="text-left mb-4 md:mb-0 md:ml-12 mt-4">
            <p className="text-black text-sm sm:text-base font-semibold mb-4">Site Map</p>
            <p className="text-black text-xs sm:text-sm mb-2">FAQ</p>
            <p className="text-black text-xs sm:text-sm mb-2">Syarat dan Ketentuan</p>
            <p className="text-black text-xs sm:text-sm">Kebijakan Privasi</p>
          </div>
          <div className="text-left mb-8 sm:mb-4 md:mb-0 mt-4">
            <p className="text-black text-sm sm:text-base font-semibold mb-4">Layanan Pengaduan</p>
            <p className="text-black font-semibold text-xs sm:text-sm mb-2">PT Rekayasa Agromarin Indonesia</p>
            <p className="text-black text-xs sm:text-sm mb-2">Citra Onyx, c22 Tanjung Uban Selatan, Bintan, Kepulauan Riau</p>
            <p className="text-black text-xs sm:text-sm">rekayasaagromarin@gmail.com / 08117775353</p>
          </div>
          <div className="text-left mb-4 md:mb-0 -mt-4">
            <p className="text-black font-semibold text-sm">Kolaborasi dengan:</p>
            <div className="flex gap-2 mb-4">
              <Image src="/images/logo/logo_undip.png" alt="Partner 1" width={50} height={20} className="w-12 h-12" />
              <Image src="/images/logo/logo_cemebsacut.png" alt="Partner 2" width={120} height={50} className="w-30 h-12" />
              <Image src="/images/logo/logo_RAI.png" alt="Partner 3" width={50} height={50} className="w-12 h-12" />
            </div>
            <p className="text-black text-sm font-semibold -mt-1">Follow Us:</p>
            <div className="flex gap-4 mb-4">
              <Image src="/images/icon/ic_twitter.png" alt="Twitter" width={24} height={24} className="w-6 h-6" />
              <Image src="/images/icon/ic_instagram.png" alt="Instagram" width={24} height={24} className="w-6 h-6" />
              <Image src="/images/icon/ic_facebook.png" alt="Facebook" width={24} height={24} className="w-6 h-6" />
              <Image src="/images/icon/ic_youtube.png" alt="YouTube" width={24} height={24} className="w-6 h-6" />
            </div>
            <p className="text-black font-semibold text-sm">Apakah Anda Tenaga Ahli Ikan?</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition mt-1">
              Daftar
            </button>
          </div>
        </div>

        {/* Teks Tambahan */}
        <div className="mt-6 text-black font-semibold text-xs sm:text-sm text-center">
          <p>
            <span className="font-bold">PT Rekayasa Agromarin Indonesia</span> | All Rights Reserved 2024
          </p>
        </div>
      </div>
    </footer>
  );
}