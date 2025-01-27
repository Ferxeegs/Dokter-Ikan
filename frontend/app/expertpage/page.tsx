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

interface ConsultationData {
  consultation_id: number;
  consultation_status: string;
  UserConsultation: {
    consultation_topic: string;
    complaint: string;
    createdAt: string;
  };
  User: {
    name: string;
  };
}

export default function DashboardExpert() {
  const [expertData, setExpertData] = useState<ExpertData | null>(null);
  const [expertId, setExpertId] = useState<number | null>(null);
  const [consultations, setConsultations] = useState<ConsultationData[]>([]);

  // Fetch expert ID from JWT token
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

  // Fetch expert data
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

  // Fetch consultation data for the expert
  useEffect(() => {
    if (expertId) {
      const fetchConsultations = async () => {
        try {
          const response = await fetch(`http://localhost:9000/consultations`);
          if (!response.ok) {
            throw new Error("Failed to fetch consultations");
          }
          const data = await response.json();
          const filteredData = data.filter(
            (consultation: any) => consultation.fishExpert_id === expertId
          );
          setConsultations(filteredData);
        } catch (error) {
          console.error("Error fetching consultations:", error);
        }
      };

      fetchConsultations();
    }
  }, [expertId]);

  // Fungsi untuk memformat tanggal
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", options);
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  // Fungsi untuk menentukan warna status berdasarkan status konsultasi
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Pending":
        return "bg-yellow-300 text-black";
      case "Completed":
        return "bg-green-400 text-white";
      case "In Progress":
        return "bg-blue-400 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

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

        <div className="flex flex-wrap justify-center gap-4 mt-20">
          {consultations.length === 0 ? (
            <p className="text-center">Tidak ada riwayat konsultasi yang ditemukan.</p>
          ) : (
            consultations.map((consultation) => (
              <button
                key={consultation.consultation_id}
                className="flex flex-col bg-white border-blue-300 border-4 text-white px-8 py-10 rounded-3xl shadow-lg hover:shadow-2xl transition w-5/12"
              >
                <div className="flex flex-row">
                  <img
                    src={"/profil.png"}
                    alt="Konsultasi Icon"
                    className="w-16 h-16 mb-4 rounded-full mr-4 bg-blue-400"
                  />
                  <div className="flex flex-col text-black text-xs justify-center text-left min-w-32">
                    <p className="font-bold text-sm">{consultation.User.name}</p>
                    <p className="font-lato">{formatDate(consultation.UserConsultation.createdAt)}</p>
                    <p className="font-lato">{formatTime(consultation.UserConsultation.createdAt)} WIB</p>
                  </div>
                  <span
                    className={`flex my-auto text-sm font-semibold italic ml-8 px-4 py-1 rounded-3xl text-center ${getStatusColor(consultation.consultation_status)}`}
                  >
                    {consultation.consultation_status}
                  </span>
                </div>
                <div className="text-right text-black font-bold mt-4 ml-20">
                  <h1 className="text-lg">{consultation.UserConsultation.consultation_topic}</h1>
                  <p className="text-justify text-sm font-thin text-black mt-1">
                    {consultation.UserConsultation.complaint.substring(0, 100)}...
                  </p>
                  <p className="font-thin text-xs mt-3 text-blue-400">Selengkapnya...</p>
                </div>
              </button>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
