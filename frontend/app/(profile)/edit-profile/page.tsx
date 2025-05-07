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
  address: string;
  province?: string;
  city?: string;
  district?: string;
  village?: string;
  phone_number?: string;
  image?: string;
}

interface Region {
  id: string;
  name: string;
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

export default function EditProfile() {
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    address: '',
    province: '',
    city: '',
    district: '',
    village: '',
    phone_number: '',
  });
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [provinces, setProvinces] = useState<Region[]>([]);
  const [cities, setCities] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const API_KEY = '35556323781a23d5a2b2bd1841f1eaf31f339f44c877fbae8c5f42dc6f19ddf8';
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
            // Ensure all string fields have default empty string values if null
            setFormData({
              name: data.data.name || '',
              email: data.data.email || '',
              address: data.data.address || '',
              province: data.data.province || '',
              city: data.data.city || '',
              district: data.data.district || '',
              village: data.data.village || '',
              phone_number: data.data.phone_number || '',
              image: data.data.image || '',
            });
            
            // If province exists, fetch related cities
            if (data.data.province) {
              fetchCities(data.data.province);
            }
            
            // If city exists, fetch related districts
            if (data.data.city) {
              fetchDistricts(data.data.city);
            }
            
            // If district exists, fetch related villages
            if (data.data.district) {
              fetchVillages(data.data.district);
            }
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

    const fetchProvinces = async () => {
      try {
        const response = await fetch(`https://api.binderbyte.com/wilayah/provinsi?api_key=${API_KEY}`);
        const data = await response.json();
        if (data.code === '200') {
          setProvinces(data.value as Region[]);
        } else {
          toast.error('Gagal memuat data provinsi');
        }
      } catch (error) {
        console.error('Error fetching provinces:', error);
        toast.error('Terjadi kesalahan saat memuat data provinsi');
      }
    };

    fetchUserData();
    fetchProvinces();
  }, [API_BASE_URL]);

  const fetchCities = async (provinceId: string) => {
    try {
      const response = await fetch(`https://api.binderbyte.com/wilayah/kabupaten?api_key=${API_KEY}&id_provinsi=${provinceId}`);
      const data = await response.json();
      if (data.code === '200') {
        setCities(data.value as Region[]);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchDistricts = async (cityId: string) => {
    try {
      const response = await fetch(`https://api.binderbyte.com/wilayah/kecamatan?api_key=${API_KEY}&id_kabupaten=${cityId}`);
      const data = await response.json();
      if (data.code === '200') {
        setDistricts(data.value as Region[]);
      }
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const fetchVillages = async (districtId: string) => {
    try {
      const response = await fetch(`https://api.binderbyte.com/wilayah/kelurahan?api_key=${API_KEY}&id_kecamatan=${districtId}`);
      const data = await response.json();
      if (data.code === '200') {
        setVillages(data.value as Region[]);
      }
    } catch (error) {
      console.error('Error fetching villages:', error);
    }
  };

  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setFormData({ ...formData, province: id, city: '', district: '', village: '' });
    setCities([]);
    setDistricts([]);
    setVillages([]);

    if (id) {
      await fetchCities(id);
    }
  };

  const handleCityChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setFormData({ ...formData, city: id, district: '', village: '' });
    setDistricts([]);
    setVillages([]);

    if (id) {
      await fetchDistricts(id);
    }
  };

  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setFormData({ ...formData, district: id, village: '' });
    setVillages([]);

    if (id) {
      await fetchVillages(id);
    }
  };

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
    
    if (!formData.address?.trim()) {
      errors.address = 'Alamat tidak boleh kosong';
    }
    
    if (!formData.province) {
      errors.province = 'Provinsi harus dipilih';
    }
    
    if (!formData.city) {
      errors.city = 'Kabupaten/Kota harus dipilih';
    }
    
    if (!formData.district) {
      errors.district = 'Kecamatan harus dipilih';
    }
    
    if (!formData.village) {
      errors.village = 'Kelurahan/Desa harus dipilih';
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
      const response = await fetch(`${API_BASE_URL}/update-profile`, {
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
          router.push('/profile-user');
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

  const getProvinceName = (id: string | undefined) => {
    if (!id) return '';
    const province = provinces.find(p => p.id === id);
    return province ? province.name : '';
  };

  const getCityName = (id: string | undefined) => {
    if (!id) return '';
    const city = cities.find(c => c.id === id);
    return city ? city.name : '';
  };

  const getDistrictName = (id: string | undefined) => {
    if (!id) return '';
    const district = districts.find(d => d.id === id);
    return district ? district.name : '';
  };

  const getVillageName = (id: string | undefined) => {
    if (!id) return '';
    const village = villages.find(v => v.id === id);
    return village ? village.name : '';
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
            <h2 className="text-3xl font-bold text-blue-800 mb-2">Edit Profil</h2>
            <p className="text-blue-600">Perbarui informasi profil Anda</p>
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
                    value={formData.name || ''}
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
                    value={formData.email || ''}
                    className="w-full p-3 text-gray-500 border border-gray-200 rounded-lg bg-gray-100 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email tidak dapat diubah</p>
                </div>

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
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="province" className="block text-blue-800 font-medium mb-2">Provinsi</label>
                  <select
                    id="province"
                    onChange={(e) => {
                      handleProvinceChange(e);
                      if (fieldErrors.province) {
                        setFieldErrors({...fieldErrors, province: ''});
                      }
                    }}
                    className={`w-full p-3 text-gray-700 border ${fieldErrors.province ? 'border-red-500 bg-red-50' : 'border-blue-200'} rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.province ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition duration-200`}
                    value={formData.province || ''}
                    
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinces.map((prov) => (
                      <option key={prov.id} value={prov.id}>{prov.name}</option>
                    ))}
                  </select>
                  {fieldErrors.province && <p className="mt-1 text-sm text-red-600">{fieldErrors.province}</p>}
                </div>

                <div>
                  <label htmlFor="city" className="block text-blue-800 font-medium mb-2">Kabupaten/Kota</label>
                  <select
                    id="city"
                    onChange={(e) => {
                      handleCityChange(e);
                      if (fieldErrors.city) {
                        setFieldErrors({...fieldErrors, city: ''});
                      }
                    }}
                    className={`w-full p-3 text-gray-700 border ${fieldErrors.city ? 'border-red-500 bg-red-50' : 'border-blue-200'} rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.city ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition duration-200`}
                    value={formData.city || ''}
                    
                    disabled={!formData.province}
                  >
                    <option value="">Pilih Kabupaten/Kota</option>
                    {cities.map((city) => (
                      <option key={city.id} value={city.id}>{city.name}</option>
                    ))}
                  </select>
                  {fieldErrors.city && <p className="mt-1 text-sm text-red-600">{fieldErrors.city}</p>}
                </div>

                <div>
                  <label htmlFor="district" className="block text-blue-800 font-medium mb-2">Kecamatan</label>
                  <select
                    id="district"
                    onChange={(e) => {
                      handleDistrictChange(e);
                      if (fieldErrors.district) {
                        setFieldErrors({...fieldErrors, district: ''});
                      }
                    }}
                    className={`w-full p-3 text-gray-700 border ${fieldErrors.district ? 'border-red-500 bg-red-50' : 'border-blue-200'} rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.district ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition duration-200`}
                    value={formData.district || ''}
                    
                    disabled={!formData.city}
                  >
                    <option value="">Pilih Kecamatan</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>{district.name}</option>
                    ))}
                  </select>
                  {fieldErrors.district && <p className="mt-1 text-sm text-red-600">{fieldErrors.district}</p>}
                </div>

                <div>
                  <label htmlFor="village" className="block text-blue-800 font-medium mb-2">Kelurahan/Desa</label>
                  <select
                    id="village"
                    onChange={(e) => {
                      setFormData({ ...formData, village: e.target.value });
                      if (fieldErrors.village) {
                        setFieldErrors({...fieldErrors, village: ''});
                      }
                    }}
                    className={`w-full p-3 text-gray-700 border ${fieldErrors.village ? 'border-red-500 bg-red-50' : 'border-blue-200'} rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.village ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition duration-200`}
                    value={formData.village || ''}
                    
                    disabled={!formData.district}
                  >
                    <option value="">Pilih Kelurahan/Desa</option>
                    {villages.map((village) => (
                      <option key={village.id} value={village.id}>{village.name}</option>
                    ))}
                  </select>
                  {fieldErrors.village && <p className="mt-1 text-sm text-red-600">{fieldErrors.village}</p>}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-blue-800 font-medium mb-2">Detail Alamat</label>
              <textarea
                id="address"
                name="address"
                value={formData.address || ''}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  if (fieldErrors.address) {
                    setFieldErrors({...fieldErrors, address: ''});
                  }
                }}
                className={`w-full p-3 text-gray-700 border ${fieldErrors.address ? 'border-red-500 bg-red-50' : 'border-blue-200'} rounded-lg focus:outline-none focus:ring-2 ${fieldErrors.address ? 'focus:ring-red-500' : 'focus:ring-blue-500'} transition duration-200`}
                placeholder="Masukkan nama jalan, nomor rumah, RT/RW, dll."
                rows={3}
                required
              />
              {fieldErrors.address && <p className="mt-1 text-sm text-red-600">{fieldErrors.address}</p>}
            </div>

            {formData.province && formData.city && formData.district && formData.village && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Alamat Lengkap</h3>
                <p className="text-blue-700">
                  {formData.address}, {getVillageName(formData.village)}, {getDistrictName(formData.district)}, {getCityName(formData.city)}, {getProvinceName(formData.province)}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-4 pt-4 border-t border-blue-100">
              <button 
                type="button" 
                onClick={() => router.push('/profile-user')}
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