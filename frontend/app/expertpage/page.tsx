'use client'

import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import jwtDecode from "jwt-decode";
import ConsultationCard from "../components/history/CardRiwayatExpert";
import Cookies from "js-cookie";
import Image from 'next/image';

interface DecodedToken {
  id: number;
}

interface ExpertData {
  name: string;
  specialization: string;
  experience: string;
  image_url: string;
}

interface ConsultationData {
  consultation_id: number;
  consultation_status: string;
  fishExpert_id: number;
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
      const fetchExpertData = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/fishexperts/${expertId}`);
          if (!response.ok) throw new Error("Failed to fetch expert data");
          const data = await response.json();
          setExpertData(data);
        } catch (error) {
          console.error("Error fetching expert data:", error);
        }
      };

      fetchExpertData();
    }
  }, [expertId, API_BASE_URL]);

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex-1 flex flex-col items-center py-10">
        {expertData ? (
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 transition-all hover:shadow-2xl">
            <div className="relative">
              <Image
                src={expertData.image_url}
                alt="Profil Dokter"
                width={160}
                height={160}
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-md transition-transform hover:scale-105"
                unoptimized={true}
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-extrabold text-blue-600">{expertData.name}</h2>
              <p className="text-lg text-gray-600 mt-2">
                <span className="font-semibold">Spesialisasi:</span> {expertData.specialization}
              </p>
              <p className="text-lg text-gray-500 mt-2">
                <span className="font-semibold">Pengalaman:</span> {expertData.experience} tahun
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xl text-gray-500">Memuat data...</p>
        )}

        <div className="mt-10 text-center">
          <h1 className="text-4xl font-bold text-blue-600">Dashboard Tenaga Ahli</h1>
          <p className="text-lg text-gray-700">Berikut adalah riwayat konsultasi yang diajukan kepada Anda:</p>
        </div>

        <div className="flex justify-center gap-4 flex-wrap my-10">
          {consultations.length === 0 ? (
            <p className="text-center text-gray-600">Tidak ada riwayat konsultasi ditemukan.</p>
          ) : (
            consultations.map((consultation) => (
              <ConsultationCard
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

      <Footer />
    </div>
  );
}