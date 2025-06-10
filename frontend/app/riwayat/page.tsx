'use client';

import { useState } from "react";
import { Info, CreditCard } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CardRiwayat from "../components/history/CardRiwayat";

export default function Riwayat() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const navigateToPaymentHistory = () => {
    // Navigate to payment history page
    window.location.href = '/riwayat-pembayaran';
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />

      <main
        className="flex-1 flex flex-col items-center text-center relative w-full"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(154, 201, 252, 1) 0.5%, rgba(255, 255, 255, 1) 80%), linear-gradient(to bottom, rgba(255, 255, 255, 1) 100%, rgba(255, 255, 255, 1) 80%)",
          backgroundSize: "cover",
          minHeight: "10vh",
          paddingTop: "5rem",
        }}
      >
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={navigateToPaymentHistory}
            className="bg-green-500 text-white p-1 sm:p-2 rounded-full hover:bg-green-600 transition z-1 shadow-md"
            aria-label="Riwayat pembayaran"
          >
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <button
            onClick={toggleModal}
            className="bg-blue-500 text-white p-1 sm:p-2 rounded-full hover:bg-blue-600 transition z-1 shadow-md"
            aria-label="Informasi status konsultasi"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="text-center px-4 sm:px-0 max-w-3xl mx-auto">
          <h1 className="text-xl sm:text-3xl font-bold mb-2 text-[#1A83FB] font-lato">
            Riwayat Konsultasi
          </h1>
          <h2 className="text-sm sm:text-lg text-[#2C2C2C]">
            Halaman ini menampilkan daftar konsultasi yang pernah Anda lakukan terkait kesehatan ikan
          </h2>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <CardRiwayat />
        </div>
      </main>

      {/* Modal untuk menampilkan status konsultasi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Keterangan Status Konsultasi
            </h3>
            <ul className="space-y-4 text-left text-gray-700">
              <li className="flex items-center gap-3">
                <span className="bg-yellow-300 text-black text-xs sm:text-sm font-semibold italic px-4 py-1 rounded-3xl">
                  Waiting
                </span>
                <span>Proses pencarian tenaga ahli</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-green-400 text-white text-xs sm:text-sm font-semibold italic px-4 py-1 rounded-3xl">
                  In Consultation
                </span>
                <span>Sesi konsultasi masih dibuka</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-gray-400 text-white text-xs sm:text-sm font-semibold italic px-4 py-1 rounded-3xl">
                  Closed
                </span>
                <span>Sesi konsultasi telah berakhir</span>
              </li>
            </ul>
            <button
              onClick={toggleModal}
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}