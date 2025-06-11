'use client'

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Image from 'next/image';
import Cookies from 'js-cookie';
import { verifyToken } from "./components/utils/auth";
// import RegisterSW from "./components/utils/RegisterSW";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const router = useRouter();

  const handleOpenModal = (message: string) => {
    setModalMessage(message);
    setIsModalOpen(true);
  };

 const handleConsultationClick = async () => {
    const token = Cookies.get('token');
    if (!token) {
      handleOpenModal("Anda harus login terlebih dahulu untuk mengakses halaman konsultasi tenaga ahli.");
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      return;
    }

    try {
      const isValid = await verifyToken();
      
      if (isValid) {
        router.push('/userpost');
      } else {
        // If token is invalid, remove it and show login message
        Cookies.remove('token');
        handleOpenModal("Sesi Anda telah berakhir. Silakan login kembali.");
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      handleOpenModal("Terjadi kesalahan saat memverifikasi sesi. Silakan coba lagi.");
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* <RegisterSW /> */}
      <Navbar />
      <main
        className="flex-1 p-6 text-center"
        style={{
          backgroundImage: "linear-gradient(to top, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 1) 100%), linear-gradient(to bottom, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 1) 100%), url('/bg_keramba.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 80%",
          minHeight: "180vh",
          paddingTop: "10rem",
        }}
      >
        <div className="ml-6 mt-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[#1A83FB] text-left font-lato">
            Solusi Cerdas Untuk Kesehatan Ikan Anda
          </h1>
          <h2 className="text-base sm:text-lg mb-6 text-[#2C2C2C] text-left">
            Konsultasi dengan Tenaga Ahli Ikan & Deteksi Penyakit Secara Instan Melalui Gambar
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 mt-20 sm:mt-60">
          <button
            className="flex flex-col items-center bg-gradient-to-b from-white to-[#BCEBFF] text-white px-8 py-10 rounded-lg shadow-lg hover:shadow-2xl transition w-full sm:w-64 mr-0 sm:mr-4 mb-4 sm:mb-0">
            <Link href="/fishdetection">
              <div className="flex flex-col items-center">
                <Image src="/images/icon/ic_brain.png" alt="Konsultasi Icon" width={64} height={64} className="w-16 h-16 mb-4" />
                <h3 className="font-bold font-sans text-sm text-[#1A83FB] mb-4">DETEKSI SPESIES IKAN</h3>
                <p className="text-xs text-black text-center">
                  Fitur ini menggunakan AI untuk menganalisis foto ikan yang diunggah oleh pembudidaya. AI mengenali ciri-ciri visual seperti bentuk tubuh, warna, dan pola sisik guna mengidentifikasi spesies ikan secara akurat.
                </p>
              </div>
            </Link>
          </button>

          <button
            className="flex flex-col items-center bg-gradient-to-b from-white to-[#BCEBFF] text-white px-8 py-10 rounded-lg shadow-lg hover:shadow-2xl transition w-full sm:w-64 mr-0 sm:mr-4 mb-4 sm:mb-0"
          >
            <Link href="/diseasedetection">
            <div className="flex flex-col items-center">
              <Image src="/images/icon/ic_fish.png" alt="Artikel Icon" width={64} height={64} className="w-16 h-16 mb-4" />
              <h3 className="font-bold font-sans text-sm text-[#1A83FB] mb-4">DETEKSI PENYAKIT IKAN</h3>
              <p className="text-xs text-black text-center">
                Fitur ini digunakan menganalisis penyakit ikan yang dengan memilih gejala penyakit. Expert System akan mendiagnosa penyakit berdasarkan gejala yang anda pilih.
              </p>
            </div>
            </Link>
          </button>

          <button
            className="flex flex-col items-center bg-gradient-to-b from-white to-[#BCEBFF] text-white px-8 py-10 rounded-lg shadow-lg hover:shadow-2xl transition w-full sm:w-64"
            onClick={handleConsultationClick}
          >
            <div className="flex flex-col items-center">
              <Image src="/images/icon/ic_konsul.png" alt="Riwayat Icon" width={64} height={64} className="w-16 h-16 mb-4" />
              <h3 className="font-bold font-sans text-sm text-[#1A83FB] mb-4">
                KONSULTASI TENAGA AHLI
              </h3>
              <p className="text-xs text-black text-center">
                Pembudidaya dapat berkonsultasi dengan tenaga ahli ikan secara daring melalui aplikasi.
                Konsultasi ini membantu pembudidaya mendapatkan saran dan solusi langsung dari ahli terkait
                kesehatan ikan, perawatan, dan resep obat.
              </p>
            </div>
          </button>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
              <h2 className="text-lg text-gray-800 font-semibold mb-4">Peringatan</h2>
              <p className="text-gray-700 mb-4">{modalMessage}</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setIsModalOpen(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}
        <p className="text-black mt-24 max-w-3xl mx-auto text-justify font-lato text-sm sm:text-base">
          Dokter Ikan adalah solusi digital inovatif untuk pemilik dan pembudidaya ikan, memanfaatkan teknologi AI untuk deteksi spesies 
          dan penyakit ikan. Aplikasi ini memudahkan pengguna dalam mendiagnosis masalah kesehatan ikan hanya dengan mengunggah foto, 
          serta menyediakan akses cepat ke obat yang direkomendasikan. Dengan integrasi fitur konsultasi online dengan tenaga ahli ikan, 
          pengguna juga dapat langsung mendapatkan saran profesional.
        </p>
      </main>
      <Footer />
    </div>
  );
}