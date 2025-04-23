'use client';

import React from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

interface ConsultationCardProps {
  consultationId: string;
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

  const handleClick = () => {
    router.push(`/expertpost?id=${consultationId}`);
  };

  return (
    <button
      className="overflow-hidden flex flex-col w-full bg-white border-blue-400 border-2 text-white px-4 py-6 sm:px-8 sm:py-10 rounded-xl shadow-lg hover:shadow-2xl transition mx-2 my-2 max-w-md"
      onClick={handleClick}
    >
      {/* Header Card */}
      <div className="flex flex-row items-center">
        <Image
          src={"images/icon/ic_profile.png"}
          alt="Konsultasi Icon"
          width={64}
          height={64}
          className="mb-4 rounded-full mr-4 bg-white w-8 h-8 md:w-12 md:h-12"
          unoptimized={true}
        />
        <div className="flex flex-col text-black text-xs sm:text-sm justify-center text-left min-w-32">
          <p className="font-bold">{userName}</p>
          <p className="font-lato">{formatDate(createdAt)}</p>
          <p className="font-lato">{formatTime(createdAt)} WIB</p>
        </div>
        <span
          className={`flex my-auto text-xs sm:text-sm font-semibold italic ml-auto px-2 sm:px-4 py-1 rounded-3xl text-center ${getStatusColor(
            consultationStatus
          )}`}
        >
          {consultationStatus}
        </span>
      </div>

      {/* Body Card */}
      <div className="text-wrap break-words text-right text-black font-bold mt-4 ml-16 sm:ml-20">
        <h1 className="text-base sm:text-lg">{consultationTopic}</h1>
        <p className="text-justify text-xs sm:text-sm font-thin text-black mt-1">
          {complaint.substring(0, 100)}...
        </p>
      </div>
    </button>
  );
};

export default ConsultationCard;