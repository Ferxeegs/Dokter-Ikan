'use client';

import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard, Clock, CheckCircle, XCircle, Info } from "lucide-react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Cookies from 'js-cookie';

interface Consultation {
  consultation_id: number;
  id: number;
}

interface Payment {
  payment_id: number;
  payment_method: string;
  total_fee: number;
  payment_status: string;
  createdAt: string;
  Consultation: Consultation;
}

interface User {
  id: number;
}

export default function RiwayatPembayaran() {
  const [user, setUser] = useState<User | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Optimized: Fetch user data and payment history in parallel when possible
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('Token tidak ditemukan. Silakan login kembali.');
        }

        // Step 1: Fetch user data first
        console.log('Fetching user data...');
        const userResponse = await fetch(`${API_BASE_URL}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            throw new Error('Sesi telah berakhir. Silakan login kembali.');
          }
          throw new Error(`Failed to fetch user data: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        console.log('User data response:', userData);
        
        if (!userData.success || !userData.data?.id) {
          throw new Error('Data user tidak valid atau user_id tidak ditemukan');
        }

        const user = userData.data;
        setUser(user);

        // Step 2: Fetch payment history using the user ID
        console.log(`Fetching payment history for user ID: ${user.id}`);
        const paymentResponse = await fetch(`${API_BASE_URL}/payments/history/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!paymentResponse.ok) {
          if (paymentResponse.status === 404) {
            // If no payment history found, set empty array
            console.log('No payment history found');
            setPaymentHistory([]);
            return;
          }
          throw new Error(`Failed to fetch payment history: ${paymentResponse.status}`);
        }

        const paymentData = await paymentResponse.json();
        console.log('Payment data response:', paymentData);
        
        if (paymentData.success && Array.isArray(paymentData.data)) {
          setPaymentHistory(paymentData.data);
        } else if (paymentData.success && paymentData.data === null) {
          // Handle case where API returns null for no data
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

    // Add a small delay to prevent too rapid requests
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
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const goBack = () => {
    window.history.back();
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar />

      <main
        className="flex-1 flex flex-col items-center text-center relative w-full"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(154, 201, 252, 1) 0.5%, rgba(255, 255, 255, 1) 80%), linear-gradient(to bottom, rgba(255, 255, 255, 1) 100%, rgba(255, 255, 255, 1) 80%)",
          backgroundSize: "cover",
          minHeight: "10vh",
          paddingTop: "5rem",
        }}
      >
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={goBack}
            className="bg-blue-500 text-white p-1 sm:p-2 rounded-full hover:bg-blue-600 transition z-1 shadow-md"
            aria-label="Kembali"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <button
          onClick={toggleModal}
          className="absolute top-4 right-4 bg-blue-500 text-white p-1 sm:p-2 rounded-full hover:bg-blue-600 transition z-1 shadow-md"
          aria-label="Informasi status pembayaran"
        >
          <Info className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="text-center px-4 sm:px-0 max-w-3xl mx-auto mb-8">
          <h1 className="text-xl sm:text-3xl font-bold mb-2 text-[#1A83FB] font-lato">
            Riwayat Pembayaran
          </h1>
          <h2 className="text-sm sm:text-lg text-[#2C2C2C]">
            Halaman ini menampilkan daftar pembayaran konsultasi yang pernah Anda lakukan
          </h2>
          {user && (
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              User ID: {user.id}
            </p>
          )}
        </div>

        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A83FB] mb-4"></div>
              <span className="text-gray-600 text-center">
                Memuat riwayat pembayaran...
              </span>
              <p className="text-xs text-gray-500 mt-2">
                Mohon tunggu sebentar
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Terjadi Kesalahan
              </h3>
              <p className="text-red-500 mb-4 max-w-md mx-auto">
                {error}
              </p>
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md"
              >
                Coba Lagi
              </button>
            </div>
          ) : paymentHistory.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Belum Ada Riwayat Pembayaran
              </h3>
              <p className="text-gray-500">
                Anda belum melakukan pembayaran konsultasi apapun
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-right text-sm text-gray-600 mb-4">
                Ditemukan {paymentHistory.length} pembayaran
              </div>
              {paymentHistory.map((payment) => (
                <div
                  key={payment.payment_id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CreditCard className="w-5 h-5 text-[#1A83FB]" />
                        <h3 className="text-lg font-semibold text-gray-800">
                          Payment ID: #{payment.payment_id}
                        </h3>
                      </div>
                      
                      <div className="space-y-2 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 font-medium">Konsultasi ID:</span>
                          <span className="text-sm text-gray-800">
                            #{payment.Consultation?.consultation_id || 'N/A'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 font-medium">Metode Pembayaran:</span>
                          <span className="text-sm text-gray-800">
                            {payment.payment_method || 'Belum dipilih'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 font-medium">Total Biaya:</span>
                          <span className="text-sm font-semibold text-[#1A83FB]">
                            {formatCurrency(payment.total_fee)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 font-medium">Tanggal:</span>
                          <span className="text-sm text-gray-800">
                            {formatDate(payment.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center sm:items-end gap-2">
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs sm:text-sm font-semibold ${getStatusColor(payment.payment_status)}`}>
                        {getStatusIcon(payment.payment_status)}
                        {getStatusText(payment.payment_status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal untuk menampilkan status pembayaran */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Keterangan Status Pembayaran
            </h3>
            <ul className="space-y-4 text-left text-gray-700">
              <li className="flex items-center gap-3">
                <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Menunggu
                </span>
                <span>Pembayaran sedang diproses</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-green-100 text-green-800 border border-green-200 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Berhasil
                </span>
                <span>Pembayaran berhasil dikonfirmasi</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-red-100 text-red-800 border border-red-200 text-xs sm:text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Gagal
                </span>
                <span>Pembayaran tidak berhasil</span>
              </li>
            </ul>
            <button
              onClick={toggleModal}
              className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}