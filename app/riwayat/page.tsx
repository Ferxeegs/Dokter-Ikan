import Link from "next/link";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Image from "next/image";


export default function Riwayat() {
    return (
        <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar/>

      {/* Main Content */}
      <main
        className="flex-1 flex flex-col items-center justify-center text-center "
        style={{
          backgroundImage: "linear-gradient(to top, rgba(154, 201, 252, 1) 0.5%, rgba(255, 255, 255, 1) 80%), linear-gradient(to bottom, rgba(255, 255, 255, 1) 100%, rgba(255, 255, 255, 1) 80%)",
          backgroundSize: "cover",
          minHeight: "10vh",
          paddingTop: "10rem",  // Menambahkan ruang di bagian atas untuk konten utama
        }}
      >
        <div className="ml-6 mt-4 text-center justify-center border-2">
          <h1 className="text-3xl font-bold mb-2 text-[#1A83FB] text-left font-lato text-center">
          Riwayat Konsultasi
          </h1>
          <h2 className="text-lg mb-6 text-[#2C2C2C] text-left">
          Masukan gejala - gejala yang diderita oleh ikan seperti perubahan pada fisik dan perilaku ikan
          </h2>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-8 mt-60">
          {/* Button Konsultasi */}
          <button className="flex flex-col bg-white border-blue-300 border-4 text-white px-8 py-10 rounded-3xl shadow-lg hover:shadow-2xl transition w-96 mr-9">
            <img src="/profil.png" alt="Konsultasi Icon" className="w-16 h-16 mb-4 rounded-full bo" />
            <h3 className="font-bold font-sans text-sm text-[#1A83FB] mb-4">DETEKSI SEPSIES IKAN</h3>
            <p className="text-xs text-black text-center">
              Fitur ini menggunakan AI untuk menganalisis foto ikan yang diunggah oleh petambak. AI mengenali ciri-ciri visual seperti bentuk tubuh, warna, dan pola sisik guna mengidentifikasi spesies ikan secara akurat.
            </p>
          </button>

          {/* Button Riwayat */}
          {/* Button Konsultasi */}
          <button className="flex flex-col bg-white border-4 text-white px-8 py-10 rounded-lg shadow-lg hover:shadow-2xl transition w-96 mr-9">
            <img src="/profil.png" alt="Konsultasi Icon" className="w-16 h-16 mb-4 rounded-full bo" />
            <h3 className="font-bold font-sans text-sm text-[#1A83FB] mb-4">DETEKSI SEPSIES IKAN</h3>
            <p className="text-xs text-black text-center">
              Fitur ini menggunakan AI untuk menganalisis foto ikan yang diunggah oleh petambak. AI mengenali ciri-ciri visual seperti bentuk tubuh, warna, dan pola sisik guna mengidentifikasi spesies ikan secara akurat.
            </p>
          </button>
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
        </div>


      </main>

      {/* Footer */}
      <Footer/>
    </div>
    );
  }
  