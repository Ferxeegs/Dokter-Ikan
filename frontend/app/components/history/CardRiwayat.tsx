'use client';

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
import Image from 'next/image';

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

interface ApiResponse {
  data: {
    consultation_id: number;
    user_consultation_id: number;
    fishExpert_id: number | null;
    fish_expert_answer_id: number | null;
    consultation_status: string;
    "UserConsultation.fish_type_id": number;
    "UserConsultation.fish_age": string;
    "UserConsultation.fish_length": string;
    "UserConsultation.consultation_topic": string;
    "UserConsultation.fish_image": string;
    "UserConsultation.complaint": string;
    "UserConsultation.created_at": string;
    "FishExpert.name": string | null;
    "FishExpert.specialization": string | null;
    "FishExpertAnswer.answer": string | null;
    "FishExpertAnswer.created_at": string | null;
  }[];
}

export default function CardRiwayat() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Ambil token dari cookies
  const token = Cookies.get("token");

  const getUserFromToken = (token: string | undefined): UserFromToken | null => {
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

  const fetchConsultations = useCallback(async () => {
    if (!token) {
      console.error("Token tidak ditemukan!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/consultation`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data: ApiResponse = await response.json();

      if (response.ok) {
        if (data && data.data) {
          // Transformasi data agar sesuai dengan tipe `Consultation`
          const transformedData = data.data.map((item) => ({
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
        console.error("Response error:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, [API_BASE_URL, token]);

  useEffect(() => {
    const user = getUserFromToken(token);
    if (user) {
      setUserName(user.name);
      fetchConsultations();
    }
  }, [token, fetchConsultations]);

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
      case "Waiting":
        return "bg-yellow-300 text-black";
      case "In Consultation":
        return "bg-green-400 text-white";
      case "Closed":
        return "bg-gray-400 text-white";
      default:
        return "bg-blue-400 text-white";
    }
  };

  const handleCardClick = (consultationId: number) => {
    router.push(`/consultation/${consultationId}`);
  };

  return (
    <div className="flex flex-wrap w-full justify-center my-16 px-4">
      {consultations.length === 0 ? (
        <p className="text-center">Tidak ada riwayat konsultasi yang ditemukan.</p>
      ) : (
        consultations.map((consultation) => {
          const {
            consultation_id,
            complaint,
            created_at,
            consultation_topic,
            consultation_status,
          } = consultation;

          return (
            <button
              key={consultation.user_consultation_id}
              className="overflow-hidden flex flex-col w-full bg-white border-blue-400 border-2 text-white px-4 py-6 sm:px-8 sm:py-10 rounded-xl shadow-lg hover:shadow-2xl transition mx-2 my-2 max-w-md"
              onClick={() => handleCardClick(consultation_id)} // Tambahkan event onClick
            >
              <div className="flex flex-row">
                <Image
                  src={"images/icon/ic_profile.png"}
                  alt="Konsultasi Icon"
                  width={64}
                  height={64}
                  className="mb-4 rounded-full mr-4 bg-white w-8 h-8 md:w-12 md:h-12"
                  unoptimized={true}
                />
                <div className="flex flex-col text-black text-xs sm:text-sm justify-center text-left min-w-32">
                  <p className="font-bold text-xs sm:text-base">{userName || "Loading..."}</p>
                  <p className="font-lato">{formatDate(created_at)}</p>
                  <p className="font-lato">{formatTime(created_at)} WIB</p>
                </div>
                <span
                  className={`flex my-auto text-xs sm:text-sm font-semibold italic ml-4 sm:ml-8 px-2 sm:px-4 py-1 rounded-3xl text-center ${getStatusColor(consultation_status)}`}
                >
                  {consultation_status}
                </span>
              </div>
              <div className="text-wrap max-w-60 break-words text-right text-black font-bold mt-4 ml-20">
                <h1 className="text-xs sm:text-lg flex">{consultation_topic}</h1>
                <p className="text-justify text-xs sm:text-sm font-thin text-black mt-1">
                  {complaint ? complaint.substring(0, 100) : "Keluhan tidak tersedia"}...
                </p>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
}