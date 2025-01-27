'use client';

import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

// Menambahkan tipe untuk data konsultasi yang mencakup hasil join dari beberapa tabel
interface Consultation {
  consultation_id: number;
  user_consultation_id: number;
  fishExpert_id: number | null;
  fish_expert_answer_id: number | null;
  consultation_status: string;

  // Data dari tabel UserConsultation
  fish_type_id: number;
  fish_age: string;
  fish_length: string;
  consultation_topic: string;
  fish_image: string;
  complaint: string;
  created_at: string;

  // Data dari tabel FishExpert
  fish_expert_name: string | null;
  fish_expert_specialization: string | null;

  // Data dari tabel FishExpertAnswer
  fish_expert_answer: string | null;
  fish_expert_answer_created_at: string | null;
}

interface UserFromToken {
  id: number;
  name: string;
}

export default function CardRiwayat() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [userName, setUserName] = useState<string>("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const getUserFromToken = (token: string | null): UserFromToken | null => {
    if (token) {
      try {
        const decodedToken: UserFromToken = jwt_decode(token);
        return decodedToken;
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const user = getUserFromToken(token);
    if (user) {
      setUserName(user.name);
      fetchConsultations(user.id);
    }
  }, [token]);

  const fetchConsultations = async (id: number) => {
    if (!token) {
      console.error("Token tidak ditemukan!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:9000/consultation`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response status:", response.status);

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        if (data && data.data) {
          // Transformasi data agar sesuai dengan tipe `Consultation`
          const transformedData = data.data.map((item: any) => ({
            consultation_id: item.consultation_id,
            user_consultation_id: item.user_consultation_id,
            fishExpert_id: item.fishExpert_id,
            fish_expert_answer_id: item.fish_expert_answer_id,
            consultation_status: item.consultation_status,

            // UserConsultation data
            fish_type_id: item["UserConsultation.fish_type_id"],
            fish_age: item["UserConsultation.fish_age"],
            fish_length: item["UserConsultation.fish_length"],
            consultation_topic: item["UserConsultation.consultation_topic"],
            fish_image: item["UserConsultation.fish_image"],
            complaint: item["UserConsultation.complaint"],
            created_at: item["UserConsultation.created_at"],

            // FishExpert data
            fish_expert_name: item["FishExpert.name"],
            fish_expert_specialization: item["FishExpert.specialization"],

            // FishExpertAnswer data
            fish_expert_answer: item["FishExpertAnswer.answer"],
            fish_expert_answer_created_at: item["FishExpertAnswer.created_at"],
          }));
          setConsultations(transformedData);
        } else {
          console.error("Data tidak ditemukan dalam response");
        }
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("id-ID", options);
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

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
    <div className="flex flex-wrap justify-center gap-4 mt-20">
      {consultations.length === 0 ? (
        <p className="text-center">Tidak ada riwayat konsultasi yang ditemukan.</p>
      ) : (
        consultations.map((consultation) => {
          const {
            complaint,
            created_at,
            consultation_topic,
            fish_image,
            consultation_status,
            fish_expert_name,
            fish_expert_answer,
          } = consultation;

          return (
            <button
              key={consultation.user_consultation_id}
              className="flex flex-col bg-white border-blue-300 border-4 text-white px-8 py-10 rounded-3xl shadow-lg hover:shadow-2xl transition w-5/12"
            >
              <div className="flex flex-row">
                <img
                  src={fish_image || "/profil.png"}
                  alt="Konsultasi Icon"
                  className="w-16 h-16 mb-4 rounded-full mr-4 bg-blue-400"
                />
                <div className="flex flex-col text-black text-xs justify-center text-left min-w-32">
                  <p className="font-bold text-sm">{userName || "Loading..."}</p>
                  <p className="font-lato">{formatDate(created_at)}</p>
                  <p className="font-lato">{formatTime(created_at)} WIB</p>
                </div>
                <span
                  className={`flex my-auto text-sm font-semibold italic ml-8 px-4 py-1 rounded-3xl text-center ${getStatusColor(consultation_status)}`}
                >
                  {consultation_status}
                </span>
              </div>
              <div className="text-right text-black font-bold mt-4 ml-20">
                <h1 className="text-lg">{consultation_topic}</h1>
                <p className="text-justify text-sm font-thin text-black mt-1">
                  {complaint ? complaint.substring(0, 100) : "Keluhan tidak tersedia"}...
                </p>
                <p className="font-thin text-xs mt-3 text-blue-400">Selengkapnya...</p>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}
