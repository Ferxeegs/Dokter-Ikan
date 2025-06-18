'use client'

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Image from 'next/image';
import { verifyToken } from "./components/utils/auth";
// import RegisterSW from "./components/utils/RegisterSW";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<'warning' | 'error' | 'info'>('warning');
  const [showLaterButton, setShowLaterButton] = useState(false);
  const router = useRouter();

  const handleOpenModal = (message: string, type: 'warning' | 'error' | 'info' = 'warning', showLater: boolean = false) => {
    setModalMessage(message);
    setModalType(type);
    setShowLaterButton(showLater);
    setIsModalOpen(true);
  };

  const handleConsultationClick = async () => {
    try {
      console.log('Calling verifyToken...');
      const result = await verifyToken();
      console.log('Verify token result:', result);
      
      if (result.success === true) {
        console.log('Token valid, redirecting to /userpost');
        router.push('/userpost');
      } else {
        // Handle different error cases
        switch (result.reason) {
          case 'no_token':
            console.log('No token found, user not logged in');
            handleOpenModal(
              "Anda belum login. Silakan login terlebih dahulu untuk mengakses fitur konsultasi.",
              'info',
              true
            );
            break;
          case 'invalid_token':
            console.log('Token invalid, session expired');
            handleOpenModal(
              "Sesi Anda telah berakhir. Silakan login kembali untuk melanjutkan.",
              'warning',
              true
            );
            break;
          case 'network_error':
            console.log('Network error occurred');
            handleOpenModal(
              "Terjadi kesalahan jaringan. Silakan periksa koneksi internet Anda dan coba lagi.",
              'error',
              true
            );
            break;
          default:
            console.log('Unknown error occurred');
            handleOpenModal(
              "Terjadi kesalahan saat memverifikasi sesi. Silakan coba lagi.",
              'error',
              true
            );
        }
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      handleOpenModal(
        "Terjadi kesalahan tak terduga. Silakan coba lagi.",
        'error',
        true
      );
    }
  };

  const handleModalOK = () => {
    setIsModalOpen(false);
    if (!showLaterButton) {
      // Auto redirect if no "Later" button
      setTimeout(() => {
        router.push('/login');
      }, 500);
    }
  };

  const handleModalLater = () => {
    setIsModalOpen(false);
    // User chose to stay on current page
  };

  const handleModalLogin = () => {
    setIsModalOpen(false);
    router.push('/login');
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
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 sm:w-96 text-center mx-4">
              <div className="mb-4">
                {modalType === 'warning' && (
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                )}
                {modalType === 'error' && (
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                    </svg>
                  </div>
                )}
                {modalType === 'info' && (
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                    </svg>
                  </div>
                )}
              </div>
              
              <h2 className={`text-lg font-semibold mb-4 ${
                modalType === 'warning' ? 'text-yellow-800' :
                modalType === 'error' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {modalType === 'warning' ? 'Peringatan' :
                 modalType === 'error' ? 'Error' :
                 'Informasi'}
              </h2>
              
              <p className="text-gray-700 mb-6 text-sm leading-relaxed">{modalMessage}</p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {showLaterButton ? (
                  <>
                    <button
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                      onClick={handleModalLogin}
                    >
                      Login Sekarang
                    </button>
                    <button
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      onClick={handleModalLater}
                    >
                      Nanti Saja
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    onClick={handleModalOK}
                  >
                    OK
                  </button>
                )}
              </div>
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