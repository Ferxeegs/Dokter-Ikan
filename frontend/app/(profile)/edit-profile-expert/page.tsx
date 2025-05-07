'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import { toast, Toaster } from 'react-hot-toast';

interface User {
  name: string;
  email: string;
  specialization?: string;
  experience?: string;
  phone_number?: string;
}

interface ServerResponse<T> {
  status: string;
  message: string;
  data: T;
  error?: {
    errors?: Array<{
      message: string;
      path: string;
      type: string;
    }>;
  };
}

export default function EditProfileExpert() {
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    specialization: '',
    experience: '',
    phone_number: '',
  });
  
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      const token = Cookies.get('token');
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setFormData(data.data || data); // Handle both response formats
          } else {
            toast.error('Gagal mengambil data profil');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Terjadi kesalahan saat mengambil data profil');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [API_BASE_URL]);

  // Validasi nomor telepon (10-15 digit)
  const validatePhoneNumber = (phoneNumber: string): boolean => {
    const regex = /^\d{10,15}$/;
    return regex.test(phoneNumber);
  };

  // Validasi form sebelum submit
  const validateForm = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    // Validasi nomor telepon
    if (formData.phone_number) {
      if (!validatePhoneNumber(formData.phone_number)) {
        errors.phone_number = 'Nomor HP harus terdiri dari 10-15 digit';
      }
    }
    
    // Validasi field wajib lainnya
    if (!formData.name?.trim()) {
      errors.name = 'Nama tidak boleh kosong';
    }
    
    if (!formData.specialization?.trim()) {
      errors.specialization = 'Spesialisasi tidak boleh kosong';
    }
    
    if (!formData.experience?.trim()) {
      errors.experience = 'Pengalaman tidak boleh kosong';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset error fields
    setFieldErrors({});
    
    // Validasi form sebelum mengirim ke server
    if (!validateForm()) {
      // Tampilkan toast untuk error validasi
      toast.error('Form berisi kesalahan. Silakan periksa kembali.');
      return;
    }
    
    const token = Cookies.get('token');
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/update-profile-expert`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const responseData: ServerResponse<User> = await response.json();

      if (response.ok) {
        toast.success(responseData.message || 'Profil berhasil diperbarui!');
        setTimeout(() => {
          router.push('/profile-expert');
        }, 2000);
      } else {
        // Handling error berdasarkan format response backend
        const errorMessage = responseData.message || 'Gagal memperbarui profil';
        
        // Handling error validasi dari Sequelize
        if (responseData.error && responseData.error.errors && responseData.error.errors.length > 0) {
          const newErrors: {[key: string]: string} = {};
          
          // Extract specific field errors
          responseData.error.errors.forEach(err => {
            if (err.path && err.message) {
              newErrors[err.path] = err.message;
              
              // Tampilkan toast untuk setiap error field
              toast.error(`${err.path}: ${err.message}`, {
                id: `field-${err.path}`,
                duration: 4000
              });
            }
          });
          
          setFieldErrors(newErrors);
        } else {
          // General error message
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Terjadi kesalahan saat memperbarui profil.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 p-8">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-xl font-medium text-blue-800">Memuat data...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300 p-4 sm:p-8">
        <div className="max-w-4xl w-full bg-white/80 backdrop-blur-lg shadow-2xl rounded-xl p-5 sm:p-8 border border-white/60">
          <div className="mb-8 border-b border-blue-200 pb-4">
            <h2 className="text-3xl font-bold text-blue-800 mb-2">Edit Profil Pakar</h2>
            <p className="text-blue-600">Perbarui informasi profil pakar Anda</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-blue-800 font-medium mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (fieldErrors.name) {
                        setFieldErrors({...fieldErrors, name: ''});
                      }
                    }}
                    className={`w-full p-3 text-gray-700 border ${fieldErrors.name ? 'border-red-500 bg-red-50' : 'border-blue-200'} rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.name ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition duration-200`}
                    required
                    placeholder="Masukkan nama lengkap"
                  />
                  {fieldErrors.name && <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-blue-800 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    className="w-full p-3 text-gray-500 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="phone_number" className="block text-blue-800 font-medium mb-2">Nomor Telepon</label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number || ''}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, ''); // Hanya terima digit
                      setFormData({ ...formData, phone_number: value });
                      
                      // Reset error jika pengguna mengedit field
                      if (fieldErrors.phone_number) {
                        setFieldErrors({...fieldErrors, phone_number: ''});
                      }
                    }}
                    className={`w-full p-3 text-gray-700 border ${fieldErrors.phone_number ? 'border-red-500 bg-red-50' : 'border-blue-200'} rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.phone_number ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition duration-200`}
                    placeholder="Contoh: 081234567890"
                    required
                    maxLength={15}
                  />
                  {fieldErrors.phone_number ? (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.phone_number}</p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">Format: 10-15 digit angka (tanpa spasi atau karakter khusus)</p>
                  )}
                </div>

                <div>
                  <label htmlFor="specialization" className="block text-blue-800 font-medium mb-2">Spesialisasi</label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, specialization: e.target.value });
                      if (fieldErrors.specialization) {
                        setFieldErrors({...fieldErrors, specialization: ''});
                      }
                    }}
                    className={`w-full p-3 text-gray-700 border ${fieldErrors.specialization ? 'border-red-500 bg-red-50' : 'border-blue-200'} rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.specialization ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition duration-200`}
                    placeholder="Masukkan spesialisasi"
                    required
                  />
                  {fieldErrors.specialization && <p className="mt-1 text-sm text-red-600">{fieldErrors.specialization}</p>}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="experience" className="block text-blue-800 font-medium mb-2">Pengalaman</label>
              <textarea
                id="experience"
                name="experience"
                value={formData.experience || ''}
                onChange={(e) => {
                  setFormData({ ...formData, experience: e.target.value });
                  if (fieldErrors.experience) {
                    setFieldErrors({...fieldErrors, experience: ''});
                  }
                }}
                className={`w-full p-3 text-gray-700 border ${fieldErrors.experience ? 'border-red-500 bg-red-50' : 'border-blue-200'} rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.experience ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition duration-200`}
                placeholder="Tuliskan detail pengalaman profesional Anda"
                rows={4}
                required
              />
              {fieldErrors.experience && <p className="mt-1 text-sm text-red-600">{fieldErrors.experience}</p>}
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-blue-100">
              <button 
                type="button" 
                onClick={() => router.push('/profile-expert')}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition duration-200"
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            padding: '16px',
            borderRadius: '10px',
          },
          success: {
            iconTheme: {
              primary: '#4CAF50',
              secondary: '#FFFFFF',
            },
            style: {
              background: '#363636',
              border: '1px solid #4CAF50',
            },
          },
          error: {
            iconTheme: {
              primary: '#E53E3E',
              secondary: '#FFFFFF',
            },
            style: {
              background: '#363636',
              border: '1px solid #E53E3E',
            },
            duration: 5000, // Error messages stay longer
          }
        }}
      />
    </>
  );
}