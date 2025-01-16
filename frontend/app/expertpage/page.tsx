'use client'

import { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import jwtDecode from "jwt-decode"; // Untuk mendekode token JWT

interface DecodedToken {
  id: number;
}

interface ExpertData {
  name: string;
  specialization: string;
  experience: string;
}

export default function DashboardExpert() {
  const [expertData, setExpertData] = useState<ExpertData | null>(null);
  const [expertId, setExpertId] = useState<number | null>(null);

  useEffect(() => {
    const fetchExpertId = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = jwtDecode<DecodedToken>(token);
          setExpertId(decodedToken.id);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };

    fetchExpertId();
  }, []);

  useEffect(() => {
    if (expertId) {
      const fetchExpertData = async () => {
        try {
          const response = await fetch(`http://localhost:9000/fishexperts/${expertId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch expert data");
          }
          const data = await response.json();
          setExpertData(data);
        } catch (error) {
          console.error("Error fetching expert data:", error);
        }
      };

      fetchExpertData();
    }
  }, [expertId]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main
        className="flex-1 flex flex-col items-center"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(154, 201, 252, 1) 0.5%, rgba(255, 255, 255, 1) 80%), linear-gradient(to bottom, rgba(255, 255, 255, 1) 100%, rgba(255, 255, 255, 1) 80%)",
          backgroundSize: "cover",
          paddingTop: "5rem",
        }}
      >
        {expertData ? (
          <div className="w-full max-w-4xl px-6 flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg py-6 mb-10">
            <div className="flex-shrink-0">
              <img
                src="/path-to-image"
                alt="Profil Dokter"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#1A83FB]"
              />
            </div>
            <div className="ml-6 text-center md:text-left">
              <h2 className="text-3xl font-bold text-[#1A83FB]">{expertData.name}</h2>
              <p className="text-lg text-gray-600 mt-2">Spesialisasi: <span className="font-medium">{expertData.specialization}</span></p>
              <p className="text-lg text-gray-500 mt-2">Pengalaman: <span className="font-medium">{expertData.experience} tahun</span></p>
            </div>
          </div>
        ) : (
          <p className="text-xl text-gray-500">Loading data...</p>
        )}

        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#1A83FB]">Dashboard Tenaga Ahli</h1>
          <p className="text-lg text-gray-700">
            Berikut adalah daftar riwayat konsultasi yang diajukan ke anda
          </p>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-2xl font-semibold text-[#1A83FB] mb-3">Ikan berenang melingkar</h3>
            <p className="text-gray-600 mb-4">
              Gejala ini sering terjadi pada ikan dengan gangguan pada sistem saraf atau infeksi parasit.
            </p>
            <button className="px-6 py-2 bg-[#1A83FB] text-white rounded-lg hover:bg-[#1569C7] transition-colors duration-300">Detail</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
