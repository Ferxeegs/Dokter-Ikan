'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Tipe data untuk response API
interface ConsultationDetail {
  consultation_id: number;
  user_id: number;
  user_consultation_id: number;
  fishExpert_id: number;
  fish_expert_answer_id: number;
  consultation_status: string;
  User: {
    user_id: number;
    name: string;
    email: string;
    address: string;
    role: string;
  };
  UserConsultation: {
    user_consultation_id: number;
    fish_type_id: number;
    fish_age: string;
    fish_length: string;
    consultation_topic: string;
    fish_image: string | null;
    complaint: string;
    consultation_status: string;
    createdAt: string;
    updatedAt: string;
  };
  FishExpert: {
    fishExperts_id: number;
    name: string;
    phone_number: string;
    specialization: string;
    experience: string;
  };
  FishExpertAnswer: {
    fish_expert_answer_id: number;
    answer: string;
    consultation_status: string;
  };
}

export default function ConsultationDetail({ params }: { params: { id: string } }) {
  const [consultationDetail, setConsultationDetail] = useState<ConsultationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!params.id) {
      console.error("Consultation ID not found.");
      return;
    }

    if (!token) {
      console.error("Token not found. Redirecting to login.");
      router.push("/login");
      return;
    }

    fetchConsultationDetail(params.id);
  }, [params.id, token]);

  const fetchConsultationDetail = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:9000/consultation/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setConsultationDetail(data);
      } else {
        console.error("Error fetching consultation detail:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!consultationDetail) {
    return <p>Consultation detail not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Detail Konsultasi</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {/* Informasi Topik dan Keluhan */}
        <h2 className="text-xl font-semibold">{consultationDetail.UserConsultation.consultation_topic}</h2>
        <p className="text-gray-600 mt-2">
          <strong>Keluhan:</strong> {consultationDetail.UserConsultation.complaint}
        </p>
        {/* Informasi User */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Informasi User</h3>
          <p><strong>Nama:</strong> {consultationDetail.User.name}</p>
          <p><strong>Email:</strong> {consultationDetail.User.email}</p>
          <p><strong>Alamat:</strong> {consultationDetail.User.address}</p>
        </div>
        {/* Informasi Dokter */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Informasi Dokter</h3>
          <p><strong>Nama:</strong> {consultationDetail.FishExpert.name}</p>
          <p><strong>Spesialisasi:</strong> {consultationDetail.FishExpert.specialization}</p>
          <p><strong>Pengalaman:</strong> {consultationDetail.FishExpert.experience}</p>
          <p><strong>No. HP:</strong> {consultationDetail.FishExpert.phone_number}</p>
        </div>
        {/* Jawaban Dokter */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Jawaban Dokter</h3>
          <p>{consultationDetail.FishExpertAnswer.answer}</p>
        </div>
        {/* Status Konsultasi */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Status Konsultasi</h3>
          <p>{consultationDetail.consultation_status}</p>
        </div>
      </div>
    </div>
  );
}
