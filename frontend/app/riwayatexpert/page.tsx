'use client';

import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import CardRiwayatExpert from "../components/history/CardRiwayatExpert";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

interface DecodedToken {
  id: number;
}

interface ConsultationData {
  consultation_id: number;
  consultation_status: string;
  fishExpert_id: number; // Tambahkan properti fishExpert_id
  UserConsultation: {
    consultation_topic: string;
    complaint: string;
    createdAt: string;
  };
  User: {
    name: string;
  };
}

export default function RiwayatExpert() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expertId, setExpertId] = useState<number | null>(null);
  const [consultations, setConsultations] = useState<ConsultationData[]>([]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        setExpertId(decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (expertId) {
      const fetchConsultations = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/consultations`);
          if (!response.ok) throw new Error("Failed to fetch consultations");
          const data: ConsultationData[] = await response.json();
          const filteredData = data
            .filter((consultation: ConsultationData) => consultation.fishExpert_id === expertId)
            .sort((a: ConsultationData, b: ConsultationData) =>
              new Date(b.UserConsultation.createdAt).getTime() - new Date(a.UserConsultation.createdAt).getTime()
            );

          setConsultations(filteredData);
        } catch (error) {
          console.error("Error fetching consultations:", error);
        }
      };

      fetchConsultations();
    }
  }, [expertId, API_BASE_URL]);

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
        <button
          onClick={toggleModal}
          className="absolute top-4 right-4 bg-blue-500 text-white p-1 sm:p-2 rounded-full hover:bg-blue-600 transition z-1"
        >
          <Info className="w-5 h-5" />
        </button>

        <div className="ml-6 text-center">
          <h1 className="text-xl sm:text-3xl font-bold mb-2 text-[#1A83FB] font-lato">
            Riwayat Konsultasi Anda
          </h1>
          <h2 className="text-sm sm:text-lg text-[#2C2C2C]">
            Halaman ini menampilkan daftar konsultasi yang pernah Anda tangani.
          </h2>
        </div>

        <div className="flex justify-center gap-4 flex-wrap mt-6 px-4">
          {consultations.length === 0 ? (
            <p className="text-gray-600">Tidak ada riwayat konsultasi.</p>
          ) : (
            consultations.map((consultation) => (
              <CardRiwayatExpert
                key={consultation.consultation_id}
                consultationId={consultation.consultation_id.toString()}
                userName={consultation.User.name}
                consultationTopic={consultation.UserConsultation.consultation_topic}
                complaint={consultation.UserConsultation.complaint}
                createdAt={consultation.UserConsultation.createdAt}
                consultationStatus={consultation.consultation_status}
              />
            ))
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Keterangan Status Konsultasi
            </h3>
            <ul className="mt-4 text-left text-gray-700">
              <li className="mb-3">
                <span className="bg-yellow-300 text-black text-sm font-semibold italic px-4 py-1 rounded-3xl">
                  Waiting
                </span>
                - Proses pencarian tenaga ahli
              </li>
              <li className="mb-3">
                <span className="bg-green-400 text-white text-sm font-semibold italic px-4 py-1 rounded-3xl">
                  In Consultation
                </span>
                - Sesi konsultasi masih dibuka
              </li>
              <li>
                <span className="bg-gray-400 text-white text-sm font-semibold italic px-4 py-1 rounded-3xl">
                  Closed
                </span>
                - Sesi konsultasi telah berakhir
              </li>
            </ul>
            <button
              onClick={toggleModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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