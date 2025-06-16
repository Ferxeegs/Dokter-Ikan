'use client';

import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, Clock, CheckCircle, XCircle, Info, User, MessageCircle, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Cookies from 'js-cookie';

// Dynamic data from API

interface Consultation {
  consultation_id: number;
  user_id: number;
  User: {
    name: string;
  };
  UserConsultation: {
    consultation_topic: string;
  };
}

interface Payment {
  payment_id: number;
  payment_method: string | null;
  total_fee: number;
  payment_status: string;
  createdAt: string;
  Consultation: Consultation;
}

interface User {
  id: number;
  name: string;
}

export default function RiwayatPembayaran() {
  const [user, setUser] = useState<User | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Pagination calculations
  const totalPages = Math.ceil(paymentHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = paymentHistory.slice(startIndex, endIndex);

  // Optimized: Fetch user data and payment history in parallel when possible
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Step 1: Fetch user data from /me endpoint
        console.log('Fetching user data...');
        const userResponse = await fetch(`${API_BASE_URL}/me`, {
          method: 'GET',
          credentials: 'include', // ⬅️ penting untuk kirim cookie HttpOnly
        });

        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            throw new Error('Sesi telah berakhir. Silakan login kembali.');
          }
          throw new Error(`Gagal mengambil data user: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        console.log('User data response:', userData);

        if (!userData.success || !userData.data?.id) {
          throw new Error('Data user tidak valid atau user_id tidak ditemukan');
        }

        const user = userData.data;
        setUser(user);

        // Step 2: Fetch payment history by user ID
        console.log(`Fetching payment history for user ID: ${user.id}`);
        const paymentResponse = await fetch(
          `${API_BASE_URL}/payments/history/${user.id}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (!paymentResponse.ok) {
          if (paymentResponse.status === 404) {
            console.log('Tidak ada riwayat pembayaran');
            setPaymentHistory([]);
            return;
          }
          throw new Error(`Gagal mengambil riwayat pembayaran: ${paymentResponse.status}`);
        }

        const paymentData = await paymentResponse.json();
        console.log('Payment data response:', paymentData);

        if (paymentData.success && Array.isArray(paymentData.data)) {
          setPaymentHistory(paymentData.data);
        } else if (paymentData.success && paymentData.data === null) {
          setPaymentHistory([]);
        } else {
          throw new Error('Format data pembayaran tidak valid');
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat memuat data');
        setPaymentHistory([]);
      } finally {
        setLoading(false);
      }
    };

    // Tambahkan sedikit delay agar tidak memicu request terlalu cepat
    const timeoutId = setTimeout(fetchData, 100);
    return () => clearTimeout(timeoutId);
  }, [API_BASE_URL]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Tanggal tidak valid';
      }
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Tanggal tidak valid';
    }
  };

  const formatCurrency = (amount: number) => {
    try {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount);
    } catch {
      return `Rp ${amount.toLocaleString('id-ID')}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'paid':
        return 'bg-gradient-to-r from-green-100 to-green-50 text-green-800 border-green-200';
      case 'pending':
      case 'waiting':
        return 'bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 border-yellow-200';
      case 'failed':
      case 'cancelled':
      case 'rejected':
        return 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border-red-200';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'waiting':
        return <Clock className="w-4 h-4" />;
      case 'failed':
      case 'cancelled':
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
      case 'paid':
        return 'Berhasil';
      case 'pending':
      case 'waiting':
        return 'Menunggu';
      case 'failed':
      case 'cancelled':
      case 'rejected':
        return 'Gagal';
      default:
        return status || 'Tidak Diketahui';
    }
  };

  const getPaymentMethodIcon = (method: string | null) => {
    if (!method) return <CreditCard className="w-4 h-4 text-gray-400" />;

    switch (method.toLowerCase()) {
      case 'bank transfer':
        return <CreditCard className="w-4 h-4 text-blue-600" />;
      case 'e-wallet':
        return <CreditCard className="w-4 h-4 text-green-600" />;
      case 'credit card':
        return <CreditCard className="w-4 h-4 text-purple-600" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-600" />;
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const goBack = () => {
    window.history.back();
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Handle card click to navigate to payment page
  const handleCardClick = (consultationId: number) => {
    window.location.href = `/payment?consultation_id=${consultationId}`;
  };

  const getPaginationNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={goBack}
                className="bg-white border border-gray-200 text-gray-600 p-2 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
                aria-label="Kembali"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Riwayat Pembayaran</h1>
                <p className="text-sm text-gray-500">Kelola dan pantau pembayaran Anda</p>
              </div>
            </div>
            <button
              onClick={toggleModal}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm"
              aria-label="Informasi status pembayaran"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        {user && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">User ID: {user.id}</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <span className="text-gray-600 text-lg font-medium">
              Memuat riwayat pembayaran...
            </span>
            <p className="text-sm text-gray-500 mt-2">
              Mohon tunggu sebentar
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Terjadi Kesalahan
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-sm font-medium"
            >
              Coba Lagi
            </button>
          </div>
        ) : paymentHistory.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Belum Ada Riwayat Pembayaran
            </h3>
            <p className="text-gray-600">
              Anda belum melakukan pembayaran konsultasi apapun
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Pembayaran</p>
                    <p className="text-xl font-bold text-gray-900">{paymentHistory.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Berhasil</p>
                    <p className="text-xl font-bold text-gray-900">
                      {paymentHistory.filter(p => p.payment_status.toLowerCase() === 'success').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Menunggu</p>
                    <p className="text-xl font-bold text-gray-900">
                      {paymentHistory.filter(p => p.payment_status.toLowerCase() === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment History List */}
            <div className="space-y-4">
              {currentItems.map((payment) => (
                <div
                  key={payment.payment_id}
                  onClick={() => handleCardClick(payment.Consultation?.consultation_id)}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 cursor-pointer transition-all duration-200 overflow-hidden group"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                Payment #{payment.payment_id}
                              </h3>
                              <p className="text-sm text-gray-500">
                                Konsultasi #{payment.Consultation?.consultation_id}
                              </p>
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <ExternalLink className="w-5 h-5 text-blue-500" />
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <User className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Nama</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {payment.Consultation?.User?.name || 'N/A'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <MessageCircle className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Topik Konsultasi</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {payment.Consultation?.UserConsultation?.consultation_topic || 'N/A'}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              {getPaymentMethodIcon(payment.payment_method)}
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Metode Pembayaran</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {payment.payment_method || 'Belum dipilih'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Tanggal</p>
                                <p className="text-sm font-medium text-gray-900">
                                  {formatDate(payment.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex flex-col items-end gap-4 lg:ml-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Biaya</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(payment.total_fee)}
                          </p>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${getStatusColor(payment.payment_status)}`}>
                          {getStatusIcon(payment.payment_status)}
                          {getStatusText(payment.payment_status)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Click indicator */}
                  <div className="px-6 pb-3">
                    <div className="text-xs text-gray-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span>Klik untuk melihat detail pembayaran</span>
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                <div className="text-sm text-gray-500">
                  Menampilkan {startIndex + 1}-{Math.min(endIndex, paymentHistory.length)} dari {paymentHistory.length} pembayaran
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Sebelumnya
                  </button>

                  <div className="flex items-center gap-1">
                    {getPaginationNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' && goToPage(page)}
                        disabled={page === '...'}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${page === currentPage
                            ? 'bg-blue-500 text-white'
                            : page === '...'
                              ? 'text-gray-400 cursor-default'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Selanjutnya
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Status Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Keterangan Status Pembayaran
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-yellow-900">Menunggu</p>
                    <p className="text-sm text-yellow-700">Pembayaran sedang diproses</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-900">Berhasil</p>
                    <p className="text-sm text-green-700">Pembayaran berhasil dikonfirmasi</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-red-900">Gagal</p>
                    <p className="text-sm text-red-700">Pembayaran tidak berhasil</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
              <button
                onClick={toggleModal}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}