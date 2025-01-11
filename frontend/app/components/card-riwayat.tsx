'use client';

import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

// Menambahkan tipe untuk data konsultasi
interface Consultation {
  user_consultation_id: number;
  user_id: number;
  fish_type_id: number;
  fish_age: string;
  fish_length: string;
  consultation_topic: string;
  fish_image: string;
  complaint: string;
  consultation_status: string;
  created_at: string;
}

interface UserFromToken {
  id: number;
  name: string;
}

export default function CardRiwayat() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [userName, setUserName] = useState<string>("");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null; // Pastikan hanya dijalankan di browser

  // Fungsi untuk mengambil nama dan user_id dari token
  const getUserFromToken = (token: string | null): UserFromToken | null => {
    if (token) {
      try {
        const decodedToken: UserFromToken = jwt_decode(token); // Dekode token untuk mengambil data
        return decodedToken; // Kembalikan user_id dan name
      } catch (error) {
        console.error("Error decoding token:", error);
        return null;
      }
    }
    return null;
  };

  // Ambil nama pengguna dan user_id dari token
  useEffect(() => {
    const user = getUserFromToken(token);
    if (user) {
      setUserName(user.name); // Set nama pengguna
      fetchConsultations(user.id); // Ambil konsultasi berdasarkan user_id
    }
  }, [token]);

  // Fungsi untuk mengambil data konsultasi berdasarkan user_id
  const fetchConsultations = async (id: number) => { // Tambahkan tipe number untuk user_id
    if (!token) {
      console.error("Token tidak ditemukan!");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:9000/user-consultation`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response status:", response.status);
  
      const data = await response.json();
      console.log("Response data:", data);
      if (response.ok) {
        setConsultations(data.data); // Data sudah difilter di backend
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

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
    <div className="flex flex-wrap justify-center gap-4 mt-20">
      {consultations.length === 0 ? (
        <p className="text-center">Tidak ada riwayat konsultasi yang ditemukan.</p>
      ) : (
        consultations.map((consultation) => (
          <button
            key={consultation.user_consultation_id}
            className="flex flex-col bg-white border-blue-300 border-4 text-white px-8 py-10 rounded-3xl shadow-lg hover:shadow-2xl transition w-5/12"
          >
            <div className="flex flex-row">
              <img
                src={consultation.fish_image || "/profil.png"}
                alt="Konsultasi Icon"
                className="w-16 h-16 mb-4 rounded-full mr-4 bg-blue-400"
              />
              <div className="flex flex-col text-black text-xs justify-center text-left min-w-32">
                <p className="font-bold text-sm">{userName || "Loading..."}</p>
                <p className="font-lato">{formatDate(consultation.created_at)}</p>
                <p className="font-lato">{formatTime(consultation.created_at)} WIB</p>
              </div>
              <span
                className={`flex my-auto text-sm font-semibold italic ml-8 px-4 py-1 rounded-3xl text-center ${getStatusColor(consultation.consultation_status)}`}
              >
                {consultation.consultation_status}
              </span>
            </div>
            <div className="text-right text-black font-bold mt-4 ml-20">
              <h1 className="text-lg">{consultation.consultation_topic}</h1>
              <p className="text-justify text-sm font-thin text-black mt-1">
                {consultation.complaint.substring(0, 100)}...
              </p>
              <p className="font-thin text-xs mt-3 text-blue-400">Selengkapnya...</p>
            </div>
          </button>
        ))
      )}
    </div>
  );
}
