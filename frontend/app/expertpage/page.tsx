'use client';

import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ConsultationCard from "../components/history/CardRiwayatExpert";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Briefcase, Award, Calendar } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalPages, setTotalPages] = useState(1);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("All");

  useEffect(() => {
    const fetchExpertId = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/me`, {
          credentials: 'include', // Token dikirim lewat HttpOnly cookie
        });

        if (!response.ok) throw new Error("Gagal mengambil data login");

        const result = await response.json();
        setExpertId(result.data.id);
      } catch (error) {
        console.error("Error fetching expert ID:", error);
      }
    };

    fetchExpertId();
  }, [API_BASE_URL]);

  // 🔹 Ambil detail tenaga ahli setelah expertId didapat
  useEffect(() => {
    if (!expertId) return;

    const fetchExpertData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/fishexperts/${expertId}`, {
          credentials: 'include',
        });

        if (!response.ok) throw new Error("Gagal mengambil data tenaga ahli");

        const data = await response.json();
        setExpertData(data.data);
      } catch (error) {
        console.error("Error fetching expert data:", error);
      }
    };

    fetchExpertData();
  }, [expertId, API_BASE_URL]);

  // 🔹 Ambil semua konsultasi lalu filter berdasarkan expertId
  useEffect(() => {
    if (!expertId) return;

    const fetchConsultations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/consultations`, {
          credentials: 'include',
        });

        if (!response.ok) throw new Error("Gagal mengambil data konsultasi");

        const data = await response.json();

        const filteredData = data.data
          .filter((consultation: ConsultationData) => consultation.fishExpert_id === expertId)
          .sort((a: ConsultationData, b: ConsultationData) =>
            new Date(b.UserConsultation.createdAt).getTime() - new Date(a.UserConsultation.createdAt).getTime()
          );

        setConsultations(filteredData);
        setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching consultations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultations();
  }, [expertId, API_BASE_URL]);

  // Filter consultations by status
  const filteredConsultations = statusFilter === "All"
    ? consultations
    : consultations.filter(consultation => consultation.consultation_status === statusFilter);

  // Calculate total pages based on filtered consultations
  useEffect(() => {
    setTotalPages(Math.ceil(filteredConsultations.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filter changes
  }, [filteredConsultations.length, itemsPerPage]);

  // Get current consultations for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentConsultations = filteredConsultations.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Format date in Indonesian format
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const pageButtons = [];
    const maxButtons = 5; // Maximum number of page buttons to show

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    // Previous button
    pageButtons.push(
      <button
        key="prev"
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className={`px-3 py-1.5 rounded-md flex items-center ${currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600 hover:bg-blue-50'
          }`}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Prev
      </button>
    );

    // First page button if not already in view
    if (startPage > 1) {
      pageButtons.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          className="px-3 py-1 rounded-md text-blue-600 hover:bg-blue-50"
        >
          1
        </button>
      );

      // Ellipsis if needed
      if (startPage > 2) {
        pageButtons.push(
          <span key="ellipsis1" className="px-2 py-1">
            ...
          </span>
        );
      }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded-md ${currentPage === i
              ? 'bg-blue-600 text-white'
              : 'text-blue-600 hover:bg-blue-50'
            }`}
        >
          {i}
        </button>
      );
    }

    // Ellipsis and last page button if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageButtons.push(
          <span key="ellipsis2" className="px-2 py-1">
            ...
          </span>
        );
      }

      pageButtons.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className="px-3 py-1 rounded-md text-blue-600 hover:bg-blue-50"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pageButtons.push(
      <button
        key="next"
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className={`px-3 py-1.5 rounded-md flex items-center ${currentPage === totalPages || totalPages === 0
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-blue-600 hover:bg-blue-50'
          }`}
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    );

    return pageButtons;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-1 flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
        {/* Expert Profile Card */}
        {isLoading ? (
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8 flex justify-center">
            <div className="animate-pulse flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-full">
              <div className="rounded-full bg-gray-200 h-40 w-40"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        ) : expertData ? (
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 transition-all hover:shadow-lg">
            <div className="relative">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500 shadow-md transition-transform hover:scale-105">
                <Image
                  src={expertData.image_url}
                  alt="Profil Tenaga Ahli"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  unoptimized={true}
                />
              </div>
            </div>
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold text-blue-600 mb-2">{expertData.name}</h2>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <div className="bg-blue-50 p-2 rounded-full mr-3">
                    <Briefcase className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Spesialisasi:</span> {expertData.specialization}
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-50 p-2 rounded-full mr-3">
                    <Award className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Pengalaman:</span> {expertData.experience} tahun
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="bg-blue-50 p-2 rounded-full mr-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-gray-700">
                    <span className="font-semibold">Bergabung sejak:</span> {formatDate("2023-01-15")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-lg text-gray-500">Memuat data tenaga ahli...</p>
        )}

        {/* Dashboard Title */}
        <div className="mt-10 text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Dashboard Tenaga Ahli</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Kelola dan tanggapi konsultasi yang diajukan oleh pengguna platform. Klik pada kartu untuk melihat detail dan menanggapi konsultasi.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="w-full max-w-4xl mt-8 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center">
            <span className="text-gray-700 font-semibold mr-3">Filter Status:</span>
            <div className="flex gap-2">
              {["All", "Waiting", "In Consultation", "Closed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${statusFilter === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <p className="text-gray-600">
            Menampilkan {filteredConsultations.length === 0 ? 0 : indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, filteredConsultations.length)} dari {filteredConsultations.length} konsultasi
          </p>
        </div>

        {/* Consultations Grid */}
        {isLoading ? (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 h-64">
                <div className="animate-pulse flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-gray-200 h-10 w-10 mr-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-5 bg-gray-200 rounded w-4/5 mb-2"></div>
                  <div className="flex-grow space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : currentConsultations.length === 0 ? (
          <div className="w-full max-w-4xl py-10 my-8 bg-white rounded-lg shadow-md text-center">
            <p className="text-xl text-gray-500">
              {filteredConsultations.length === 0
                ? "Tidak ada riwayat konsultasi ditemukan."
                : "Tidak ada konsultasi yang sesuai dengan filter yang dipilih."}
            </p>
          </div>
        ) : (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
            {currentConsultations.map((consultation) => (
              <ConsultationCard
                key={consultation.consultation_id}
                consultationId={consultation.consultation_id.toString()}
                userName={consultation.User.name}
                consultationTopic={consultation.UserConsultation.consultation_topic}
                complaint={consultation.UserConsultation.complaint}
                createdAt={consultation.UserConsultation.createdAt}
                consultationStatus={consultation.consultation_status}
              />
            ))}
          </div>
        )}

        {/* Pagination controls */}
        {filteredConsultations.length > 0 && (
          <div className="w-full max-w-4xl flex justify-center mt-4 mb-8">
            <div className="flex items-center space-x-1">
              {renderPaginationButtons()}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}