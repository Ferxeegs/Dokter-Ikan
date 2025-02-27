import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white p-6 text-center font-sans">
      <div className="bg-[rgba(105,203,244,0.26)] p-8 rounded-lg shadow-lg mx-4">
        <div className="flex items-center ml-16">
          <Image src="/images/logo/logo_dokterikan512.png" alt="Home Icon" width={64} height={96} />
          <Image src="/images/logo/logo_dokterikan.png" alt="Extra Icon" width={164} height={164} />
        </div>

        {/* Kolom Teks */}
        <div className="flex justify-center gap-60 mb-4">
          <div className="text-left ml-12 mt-4">
            <p className="text-black font-semibold mb-4">Site Map</p>
            <p className="text-black text-sm mb-2">FAQ</p>
            <p className="text-black text-sm mb-2">Syarat dan Ketentuan</p>
            <p className="text-black text-sm">Kebijakan Privasi</p>
          </div>
          <div className="text-left mt-4">
            <p className="text-black font-semibold mb-4">Layanan Pengaduan</p>
            <p className="text-black font-semibold text-sm mb-2">PT Rekayasa Agromarin Indonesia</p>
            <p className="text-black text-sm mb-2">Citra Onyx, c22 Tanjung Uban Selatan, Bintan, Kepulauan Riau</p>
            <p className="text-black text-sm">rekayasaagromarin@gmail.com / 08117775353</p>
          </div>
          <div className="text-left -mt-4">
            <p className="text-black font-semibold text-sm">Kolaborasi dengan:</p>
            <div className="flex gap-4 mb-0">
              <Image src="/images/logo/logo_undip.png" alt="Partner 1" width={50} height={20} />
              <Image src="/images/logo/logo_cemebsacut.png" alt="Partner 2" width={120} height={50} />
              <Image src="/images/logo/logo_rai.png" alt="Partner 3" width={50} height={50} />
            </div>
            <p className="text-black font-semibold -mt-1">Follow Us:</p>
            <div className="flex gap-4 mb-1">
              <Image src="/images/icon/ic_twitter.png" alt="Facebook" width={24} height={24} />
              <Image src="/images/icon/ic_instagram.png" alt="Twitter" width={24} height={24} />
              <Image src="/images/icon/ic_facebook.png" alt="Instagram" width={24} height={24} />
              <Image src="/images/icon/ic_youtube.png" alt="YouTube" width={24} height={24} />
            </div>
            <p className="text-black font-semibold text-sm">Apakah Anda Tenaga Ahli Ikan?</p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition mt-1">
              Daftar
            </button>
          </div>
        </div>

        {/* Teks Tambahan */}
        <div className="mt-6 text-black font-semibold text-sm text-center">
          <p>
            <span className="font-bold">PT Rekayasa Agromarin Indonesia</span> | All Rights Reserved 2024
          </p>
        </div>
      </div>
    </footer>
  );
}
