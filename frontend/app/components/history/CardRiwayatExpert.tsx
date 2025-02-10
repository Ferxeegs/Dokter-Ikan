'use client';

import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter dari next/navigation

interface ConsultationCardProps {
  consultationId: string; // ID unik konsultasi
  userName: string;
  consultationTopic: string;
  complaint: string;
  createdAt: string;
  consultationStatus: string;
}

// Fungsi untuk memformat tanggal
const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

// Fungsi untuk memformat waktu
const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};

// Fungsi untuk menentukan warna status berdasarkan status konsultasi
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

const ConsultationCard: React.FC<ConsultationCardProps> = ({
  consultationId,
  userName,
  consultationTopic,
  complaint,
  createdAt,
  consultationStatus,
}) => {
  const router = useRouter(); 
  
  console.log({
    consultationId,
    userName,
    consultationTopic,
    complaint,
    createdAt,
    consultationStatus,
  });// Gunakan useRouter dari next/navigation

  const handleClick = () => {
    router.push(`/expertpost/${consultationId}`); // Arahkan ke halaman detail dengan ID konsultasi
  };

  return (
    <button
      className="overflow-hidden flex flex-col w-full bg-white border-blue-400 border-2 text-white px-8 py-10 rounded-xl shadow-lg hover:shadow-2xl transition mx-2 my-2 max-w-md"
      onClick={handleClick} // Gunakan handleClick untuk navigasi
    >
      {/* Header Card */}
      <div className="flex flex-row">
        <img
          src="/profil.png"
          alt="Konsultasi Icon"
          className="w-16 h-16 mb-4 rounded-full mr-4 bg-blue-400"
        />
        <div className="flex flex-col text-black text-xs justify-center text-left min-w-32">
          <p className="font-bold text-sm">{userName}</p>
          <p className="font-lato">{formatDate(createdAt)}</p>
          <p className="font-lato">{formatTime(createdAt)} WIB</p>
        </div>
        <span
          className={`flex my-auto text-sm font-semibold italic ml-8 px-4 py-1 rounded-3xl text-center ${getStatusColor(
            consultationStatus
          )}`}
        >
          {consultationStatus}
        </span>
      </div>

      {/* Body Card */}
      <div className=" text-wrap max-w-60 break-words text-right text-black font-bold mt-4 ml-20">
        <h1 className="text-lg">{consultationTopic}</h1>
        <p className="text-justify text-sm font-thin text-black mt-1">
          {complaint.substring(0, 100)}...
        </p>
      </div>
    </button>
  );
};

export default ConsultationCard;
