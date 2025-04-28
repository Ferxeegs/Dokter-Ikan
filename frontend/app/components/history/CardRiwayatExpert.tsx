'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, User, ChevronRight} from "lucide-react";

interface ConsultationCardProps {
  consultationId: string;
  userName: string;
  consultationTopic: string;
  complaint: string;
  createdAt: string;
  consultationStatus: string;
}

const CardRiwayatExpert: React.FC<ConsultationCardProps> = ({
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

  return (
    <button
      className="relative overflow-hidden flex flex-col bg-white border-l-4 border-blue-400 text-left px-4 py-4 rounded-lg shadow-md hover:shadow-lg transition group h-full"
      style={{ borderLeftWidth: '6px' }}
      onClick={handleClick}
    >
      {/* Status Badge */}
      <span className={`absolute top-3 right-3 text-xs font-semibold italic px-3 py-1 rounded-full ${getStatusColor(consultationStatus)}`}>
        {consultationStatus}
      </span>
      
      {/* User Info */}
      <div className="flex items-center mb-4 mt-1">
        <div className="bg-blue-100 p-2 rounded-full mr-3">
          <User className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <p className="font-bold text-gray-800">{userName}</p>
        </div>
      </div>
      
      {/* Date & Time */}
      <div className="flex items-center text-xs text-gray-500 mb-4">
        <Calendar className="w-3 h-3 mr-1" />
        <span className="mr-3">{formatDate(createdAt)}</span>
        <Clock className="w-3 h-3 mr-1" />
        <span>{formatTime(createdAt)} WIB</span>
      </div>
      
      {/* Topic & Complaint */}
      <div className="flex-grow">
        <h2 className="text-base font-bold text-blue-600 mb-2 line-clamp-1">
          {consultationTopic}
        </h2>
        <p className="text-sm text-gray-600 line-clamp-3">
          {complaint || "Keluhan tidak tersedia"}
        </p>
      </div>
      
      {/* View Details Button */}
      <div className="mt-4 pt-2 border-t border-gray-100 flex justify-end">
        <span className="text-xs text-blue-500 group-hover:underline flex items-center">
          Lihat Detail
          <ChevronRight className="w-4 h-4 ml-1" />
        </span>
      </div>
    </button>
  );
};

export default CardRiwayatExpert;