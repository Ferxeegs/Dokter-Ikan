import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-white text-black font-bold p-4 sticky top-0 z-10">
        {/* Icon di sisi kiri */}
        <div className="flex items-center">
          <Image src="/icon512.png" alt="Home Icon" width={64} height={96} />
          <Image src="/icondokterikan.png" alt="Extra Icon" width={164} height={164} />
        </div>

        {/* Menu di tengah */}
        <div className="flex space-x-14 text-1xl font-semibold font-sans ml-40 -mr-8">
          <a href="#beranda" className="hover:underline">Beranda</a>
          <a href="#artikel" className="hover:underline">Artikel</a>
          <a href="#riwayat" className="hover:underline">Riwayat</a>
        </div>

        {/* Button Login */}
        <button 
          className="bg-[#69CBF4] text-white px-6 py-1 rounded-lg hover:bg-[#4AABDE] transition text-1x1 font-sans font-semibold mr-8"
        >
          Login
        </button>
      </nav>

      {/* Main Content */}
      <main
        className="flex-1 p-6 text-center"
        style={{
          backgroundImage: "linear-gradient(to top, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 1) 100%), linear-gradient(to bottom, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 1) 100%), url('/homebg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 15%",  // Menurunkan posisi gambar latar belakang
          minHeight: "180vh",
          paddingTop: "10rem",  // Menambahkan ruang di bagian atas untuk konten utama
        }}
      >
        <div className="ml-6 mt-4">
          <h1 className="text-3xl font-bold mb-2 text-[#1A83FB] text-left font-lato">
            Solusi Cerdas Untuk Kesehatan Ikan Anda
          </h1>
          <h2 className="text-lg mb-6 text-[#2C2C2C] text-left">
            Konsultasi dengan Ahli Ikan & Deteksi Penyakit Secara Instan Melalui Gambar
          </h2>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-8 mt-60">
          {/* Button Konsultasi */}
          <button className="flex flex-col items-center bg-gradient-to-b from-white to-[#BCEBFF] text-white px-8 py-10 rounded-lg shadow-lg hover:shadow-2xl transition w-64 mr-4">
            <img src="/brain.png" alt="Konsultasi Icon" className="w-16 h-16 mb-4" />
            <h3 className="font-bold font-sans text-sm text-[#1A83FB] mb-4">DETEKSI SEPSIES IKAN</h3>
            <p className="text-xs text-black text-center">
              Fitur ini menggunakan AI untuk menganalisis foto ikan yang diunggah oleh petambak. AI mengenali ciri-ciri visual seperti bentuk tubuh, warna, dan pola sisik guna mengidentifikasi spesies ikan secara akurat.
            </p>
          </button>

          {/* Button Artikel */}
          <button className="flex flex-col items-center bg-gradient-to-b from-white to-[#BCEBFF] text-white px-8 py-10 rounded-lg shadow-lg hover:shadow-2xl transition w-64 mr-4">
            <img src="/fish.png" alt="Artikel Icon" className="w-16 h-16 mb-4" />
            <h3 className="font-bold font-sans text-sm text-[#1A83FB] mb-4">DETEKSI PENYAKIT IKAN</h3>
            <p className="text-xs text-black text-center">
              Fitur ini digunakan menganalisis penyakit ikan yang telah di unggah. AI akan mendeteksi gejala penyakit, seperti perubahan warna, luka, atau tanda-tanda abnormal lainnya pada tubuh ikan.
            </p>
          </button>

          {/* Button Riwayat */}
          <button className="flex flex-col items-center bg-gradient-to-b from-white to-[#BCEBFF] text-white px-8 py-10 rounded-lg shadow-lg hover:shadow-2xl transition w-64 sm:w-72">
            <Link href="/userpost">
              <div className="flex flex-col items-center">
                <img src="/konsul.png" alt="Riwayat Icon" className="w-16 h-16 mb-4" />
                <h3 className="font-bold font-sans text-sm sm:text-base text-[#1A83FB] mb-4">
                  KONSULTASI TENAGA AHLI
                </h3>
                <p className="text-xs sm:text-sm text-black text-center">
                  Petambak dapat berkonsultasi dengan tenaga ahli ikan secara daring melalui aplikasi.
                  Konsultasi ini membantu petambak mendapatkan saran dan solusi langsung dari ahli terkait
                  kesehatan ikan, perawatan, dan resep obat.
                </p>
              </div>
            </Link>
          </button>
        </div>

        {/* Keterangan */}
        <p className="text-black mt-24 max-w-3xl mx-auto text-justify font-lato">
          Dokter Ikan adalah solusi digital inovatif untuk pemilik dan peternak ikan, memanfaatkan teknologi AI untuk deteksi spesies dan penyakit ikan. Aplikasi ini memudahkan pengguna dalam mendiagnosis masalah kesehatan ikan hanya dengan mengunggah foto, serta menyediakan akses cepat ke obat yang direkomendasikan. Dengan integrasi fitur konsultasi online dengan dokter spesialis, pengguna juga dapat langsung mendapatkan saran profesional tanpa harus keluar rumah.
        </p>

      </main>

      {/* Footer */}
      <footer className="bg-white p-6 text-center font-sans">
        {/* Kotak persegi panjang dengan background biru untuk membungkus konten */}
        <div className="bg-[rgba(105,203,244,0.26)] p-8 rounded-lg shadow-lg mx-4">
          <div className="flex items-center ml-16">
            <Image src="/icon512.png" alt="Home Icon" width={64} height={96} />
            <Image src="/icondokterikan.png" alt="Extra Icon" width={164} height={164} />
          </div>

          {/* Kolom Teks */}
          <div className="flex justify-center gap-60 mb-4">
            {/* Kolom pertama */}
            <div className="text-left ml-12 mt-4">
              <p className="text-black font-semibold mb-4">Site Map</p>
              <p className="text-black text-sm mb-2">FAQ</p>
              <p className="text-black text-sm mb-2">Syarat dan Ketentuan</p>
              <p className="text-black text-sm">Kebijakan Privasi</p>
            </div>

            {/* Kolom kedua */}
            <div className="text-left mt-4">
              <p className="text-black font-semibold mb-4">Layanan Pengaduan</p>
              <p className="text-black font-semibold text-sm mb-2">PT Rekayasa Agromarin Indonesia</p>
              <p className="text-black text-sm mb-2">Jl. H.R. Rasuna Said, Jakarta Selatan</p>
              <p className="text-black text-sm">help@dokterikan.com/012-3456-7890</p>
            </div>

            {/* Kolom ketiga */}
            <div className="text-left -mt-4">
              {/* Kolaborasi dengan Gambar */}
              <p className="text-black font-semibold text-sm">Kolaborasi dengan:</p>
              <div className="flex gap-4 mb-0">
                <Image src="/cemebsa.png" alt="Partner 1" width={120} height={50} />
                <Image src="/rai.png" alt="Partner 2" width={50} height={50} />
              </div>

              {/* Ikon Sosial Media */}
              <p className="text-black font-semibold -mt-1">Follow Us:</p>
              <div className="flex gap-4 mb-1">
                <Image src="/twitter.png" alt="Facebook" width={24} height={24} />
                <Image src="/instagram.png" alt="Twitter" width={24} height={24} />
                <Image src="/facebook.png" alt="Instagram" width={24} height={24} />
                <Image src="/youtube.png" alt="YouTube" width={24} height={24} />
              </div>

              {/* Tanya Apakah Anda Tenaga Ahli */}
              <p className="text-black font-semibold text-sm">Apakah Anda Tenaga Ahli Ikan?</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-500 transition mt-1">
                Daftar
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}