'use client';

import { useState } from "react";
import { Info } from "lucide-react"; // Menggunakan ikon dari lucide-react
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CardRiwayat from "../components/history/CardRiwayat";

export default function Riwayat() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
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
        {/* Tombol ikon berada di pojok kanan atas */}
        <button
          onClick={toggleModal}
          className="absolute top-4 right-4 bg-blue-500 text-white p-1 sm:p-2 rounded-full hover:bg-blue-600 transition z-1"
        >
          <Info className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="ml-6 text-center px-4 sm:px-0">
          <h1 className="text-xl sm:text-3xl font-bold mb-2 text-[#1A83FB] font-lato">
            Riwayat Konsultasi
          </h1>
          <h2 className="text-sm sm:text-lg text-[#2C2C2C]">
            Halaman ini menampilkan daftar konsultasi yang pernah Anda lakukan terkait kesehatan ikan
          </h2>
        </div>

        <div className="flex justify-center gap-4 flex-wrap mt-6 px-4 sm:px-0">
          <CardRiwayat />
        </div>
      </main>

      {/* Modal untuk menampilkan status konsultasi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-auto text-center">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-800">
              Keterangan Status Konsultasi
            </h3>
            <ul className="mt-4 text-left text-gray-700">
              <li className="mb-3 text-sm sm:text-lg">
                <span className="bg-yellow-300 text-black text-xs sm:text-sm font-semibold italic px-4 py-1 rounded-3xl">
                  Waiting
                </span>
                - Proses pencarian tenaga ahli
              </li>
              <li className="mb-3 text-sm sm:text-lg">
                <span className="bg-green-400 text-white text-xs sm:text-sm font-semibold italic px-4 py-1 rounded-3xl">
                  In Consultation
                </span>
                - Sesi konsultasi masih dibuka
              </li>
              <li className="text-sm sm:text-lg">
                <span className="bg-gray-400 text-white text-xs sm:text-sm font-semibold italic px-4 py-1 rounded-3xl">
                  Closed
                </span>
                - Sesi konsultasi telah berakhir
              </li>
            </ul>
            <button
              onClick={toggleModal}
              className="mt-4 px-2 sm:px-4 py-1 sm:py-2 text-sm sm:text-lg bg-red-500 text-white rounded-lg hover:bg-red-600"
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