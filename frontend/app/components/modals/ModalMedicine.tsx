'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
// ...existing code...

interface Medicine {
  medicine_id: number;
  vendor_id: number;
  medicine_name: string;
  contain: string;
  dosage: string;
  medicine_image: string;
}

interface ModalObatProps {
  isOpen: boolean;
  toggleModal: () => void;
  consultationId: string;
}

interface UserInfo {
  id: number;
  // tambahkan field lain sesuai kebutuhan
}

interface PrescriptionData {
  prescription_id: number;
  consultation_id: string;
  fishExperts_id: number;
  instruction: string;
  created_at: string;
  updated_at?: string;
  // tambahkan field lain sesuai struktur data dari API
}

const ModalObat: React.FC<ModalObatProps> = ({ isOpen, toggleModal, consultationId }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [instruction, setInstruction] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSubmittedPrescription, setHasSubmittedPrescription] = useState<boolean>(false);
  const [prescriptionData, setPrescriptionData] = useState<PrescriptionData | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Fungsi untuk mendapatkan informasi user dari server
  const fetchUserInfo = async (): Promise<UserInfo | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        method: 'GET',
        credentials: 'include', // Penting untuk mengirim HTTP-only cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const data = await response.json();
      return data.user || data.data || data; // Sesuaikan dengan struktur response API
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  // Fungsi untuk melakukan API call dengan credentials
  const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    return fetch(url, {
      ...options,
      credentials: 'include', // Selalu sertakan HTTP-only cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  };

  // Menggunakan endpoint baru untuk mengecek prescription
  const checkExistingPrescription = async () => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/check/${consultationId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Prescription check response:', data);
        
        if (data.data && data.data.exists) {
          setHasSubmittedPrescription(true);
          setPrescriptionData(data.data.prescription);
        } else {
          setHasSubmittedPrescription(false);
          setPrescriptionData(null);
        }
      } else {
        console.error('Error checking prescription:', response.statusText);
        // Jika error, anggap belum pernah submit untuk menghindari false positive
        setHasSubmittedPrescription(false);
      }
    } catch (error) {
      console.error('Error checking existing prescription:', error);
      // Jika error, anggap belum pernah submit untuk menghindari false positive
      setHasSubmittedPrescription(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Reset state ketika modal dibuka
      setHasSubmittedPrescription(false);
      setPrescriptionData(null);
      setSelectedMedicines([]);
      setInstruction('');
      setSearchQuery('');
      
      // Fetch user info, medicines, dan cek existing prescription secara parallel
      const loadData = async () => {
        setLoading(true);
        try {
          const [user, medicinesResponse] = await Promise.all([
            fetchUserInfo(),
            authenticatedFetch(`${API_BASE_URL}/medicines`)
          ]);

          setUserInfo(user);

          if (medicinesResponse.ok) {
            const medicinesData = await medicinesResponse.json();
            setMedicines(medicinesData.data);
          } else {
            console.error('Error fetching medicines:', medicinesResponse.statusText);
          }

          // Cek apakah sudah ada prescription untuk konsultasi ini
          await checkExistingPrescription();
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }
  }, [isOpen, API_BASE_URL, consultationId]);

  const handleSelectMedicine = (medicine_id: number) => {
    // Tidak bisa memilih obat jika sudah pernah submit
    if (hasSubmittedPrescription) return;
    
    setSelectedMedicines((prev) =>
      prev.includes(medicine_id) ? prev.filter(id => id !== medicine_id) : [...prev, medicine_id]
    );
  };

  const handleConfirm = async () => {
    if (!consultationId || !userInfo?.id) {
      alert('Gagal mendapatkan ID konsultasi atau ID ahli ikan.');
      return;
    }

    // Double check untuk memastikan tidak bisa submit lagi
    if (hasSubmittedPrescription) {
      alert('Resep untuk konsultasi ini sudah pernah dikirim.');
      return;
    }

    // Cek lagi sebelum submit untuk memastikan tidak ada race condition
    try {
      await checkExistingPrescription();
      if (hasSubmittedPrescription) {
        alert('Resep untuk konsultasi ini sudah pernah dikirim.');
        setShowConfirmation(false);
        return;
      }
    } catch (error) {
      console.error('Error double-checking prescription:', error);
    }

    const requestPayload = {
      consultation_id: consultationId,
      fishExperts_id: userInfo.id,
      instruction,
    };

    try {
      setLoading(true);

      // Create prescription
      const prescriptionResponse = await authenticatedFetch(`${API_BASE_URL}/prescriptions`, {
        method: 'POST',
        body: JSON.stringify(requestPayload),
      });

      if (!prescriptionResponse.ok) {
        const errorData = await prescriptionResponse.json();
        
        // Cek jika error karena prescription sudah ada
        if (prescriptionResponse.status === 400 && errorData.message?.includes('sudah ada')) {
          setHasSubmittedPrescription(true);
          setShowConfirmation(false);
          alert('Resep untuk konsultasi ini sudah pernah dikirim.');
          return;
        }
        
        throw new Error(errorData.message || 'Gagal menambahkan prescription');
      }

      const prescriptionData = await prescriptionResponse.json();
      const prescription_id = prescriptionData.data.prescription_id;

      // Add medicines to prescription
      const medicinePayloads = selectedMedicines.map(medicine_id => ({
        prescription_id,
        medicine_id,
      }));

      const medicineResponses = await Promise.all(
        medicinePayloads.map(payload =>
          authenticatedFetch(`${API_BASE_URL}/prescriptions-medicines`, {
            method: 'POST',
            body: JSON.stringify(payload),
          })
        )
      );

      // Check if any medicine addition failed
      const failedResponses = medicineResponses.filter(response => !response.ok);
      if (failedResponses.length > 0) {
        throw new Error('Gagal menambahkan beberapa obat ke resep.');
      }

      // Set flag bahwa sudah berhasil submit
      setHasSubmittedPrescription(true);
      
      // Tampilkan modal sukses
      setShowConfirmation(false);
      setShowSuccessModal(true);
      
    } catch (error) {
    if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
    } else {
        console.log('An unexpected error occurred');
        toast.error('An unexpected error occurred');
    }
}
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    toggleModal();
    
    // Tidak reset form karena prescription sudah terkirim
    // Form akan di-reset saat modal dibuka kembali
  };

  if (!isOpen) return null;

  // Filter daftar obat berdasarkan searchQuery
  const filteredMedicines = medicines.filter((item) =>
    item.medicine_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={toggleModal}>
        <div
          className="bg-white p-6 rounded-xl w-[90%] md:w-[60%] max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-bold mb-4 text-center text-black">Rekomendasi Obat</h2>

          {hasSubmittedPrescription && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-sm font-medium">Resep untuk konsultasi ini sudah berhasil dikirim</p>
                  {prescriptionData && (
                    <p className="text-xs mt-1">
                      Dikirim pada: {new Date(prescriptionData.created_at).toLocaleString('id-ID')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center mb-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              <p className="text-sm text-gray-600 mt-2">Memuat data...</p>
            </div>
          )}

          <input
            type="text"
            placeholder="Cari obat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded-lg text-black"
            disabled={loading || hasSubmittedPrescription}
          />

          <div className="max-h-[50vh] overflow-y-auto flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMedicines.map((item) => (
                <div
                  key={item.medicine_id}
                  className={`flex items-center p-4 bg-gradient-to-r from-[#DCF5FF] to-[#80B7F5] rounded-lg shadow transition-all hover:shadow-md ${
                    selectedMedicines.includes(item.medicine_id) 
                      ? 'border-2 border-blue-500 ring-2 ring-blue-200' 
                      : 'border border-transparent'
                  } ${
                    loading || hasSubmittedPrescription 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer'
                  }`}
                  onClick={() => !loading && !hasSubmittedPrescription && handleSelectMedicine(item.medicine_id)}
                >
                  <Image
                    src={item.medicine_image}
                    alt={item.medicine_name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-lg object-cover"
                    unoptimized={true}
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-bold text-black text-xs mb-1">{item.medicine_name}</h3>
                    <p className="text-xs text-gray-700 mb-1">Kandungan: {item.contain}</p>
                    <p className="text-xs text-gray-700">Dosis: {item.dosage}</p>
                  </div>
                  {selectedMedicines.includes(item.medicine_id) && (
                    <div className="ml-2 text-blue-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {filteredMedicines.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                <p>Tidak ada obat yang ditemukan</p>
              </div>
            )}
          </div>

          <textarea
            placeholder="Tambahkan instruksi penggunaan obat..."
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            className="w-full px-4 py-2 mt-4 border rounded-lg text-black resize-none"
            rows={3}
            disabled={loading || hasSubmittedPrescription}
          />

          <div className="mt-4 text-sm text-gray-600">
            <p>Obat terpilih: {selectedMedicines.length}</p>
          </div>

          {!hasSubmittedPrescription ? (
            <button
              className="mt-4 bg-[#1A83FB] text-white px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold w-full disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setShowConfirmation(true)}
              disabled={loading || selectedMedicines.length === 0}
            >
              {loading ? 'Memproses...' : 'Kirim Resep ke Klien'}
            </button>
          ) : (
            <div className="mt-4 bg-gray-100 text-gray-600 px-6 py-2 rounded-lg text-sm font-semibold w-full text-center">
              Resep Sudah Dikirim
            </div>
          )}
        </div>
      </div>

      {/* Modal Konfirmasi */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-4">
            <h3 className="text-lg text-black font-semibold mb-4">Konfirmasi Resep</h3>
            <div className="text-left mb-4 text-sm text-gray-700">
              <p><strong>Obat terpilih:</strong> {selectedMedicines.length} item</p>
              <p><strong>Instruksi:</strong> {instruction || 'Tidak ada instruksi khusus'}</p>
            </div>
            <p className="text-gray-600 mb-6">Apakah Anda yakin dengan resep yang akan diberikan?</p>
            <div className="flex gap-3 justify-center">
              <button 
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50" 
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? 'Mengirim...' : 'Ya, Kirim'}
              </button>
              <button 
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition" 
                onClick={() => setShowConfirmation(false)}
                disabled={loading}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sukses */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md mx-4">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl text-black font-semibold mb-2">Resep Berhasil Dikirim!</h3>
              <p className="text-gray-600 text-sm">
                Resep dengan {selectedMedicines.length} obat telah berhasil dikirim ke klien.
              </p>
            </div>
            <button 
              className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition font-semibold w-full" 
              onClick={handleSuccessModalClose}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalObat;