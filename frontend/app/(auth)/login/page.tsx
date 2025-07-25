'use client';

import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify'; // Import notifikasi
import 'react-toastify/dist/ReactToastify.css'; // Gaya notifikasi
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Image from 'next/image';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State untuk loading
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // Fungsi untuk menangani perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  // Fungsi untuk menyimpan token di cookies
  // const saveToken = (token: string) => {
  //   Cookies.set('token', token, { expires: 1 / 24, secure: true, sameSite: 'None' });
  // };

  // Fungsi untuk menangani pengiriman formulir login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading menjadi true saat tombol ditekan
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const data = {
      email,
      password,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();

        toast.success('Login berhasil! Mengarahkan...');

        setTimeout(() => {
          if (result.data.user.role === 'user') {
            router.push('/');
          } else if (result.data.user.role === 'expert') {
            router.push('/expertpage');
          } else {
            toast.error('Peran tidak dikenal. Silakan hubungi dukungan.');
          }
        }, 2000);
      } else {
        const result = await response.json();
        // Menampilkan notifikasi error dengan pesan dari server
        if (result.message) {
          toast.error(result.message);
        } else {
          toast.error('Login gagal, silakan coba lagi.');
        }
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Terjadi kesalahan saat login.');
    } finally {
      setLoading(false); // Set loading menjadi false setelah proses selesai
    }
  };

  // Fungsi untuk kembali ke halaman utama
  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <div>
      <Head>
        <title>Login</title>
        <meta name="description" content="Login Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section
        className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: "url('/bg_login.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'top',
        }}
      >
        {/* Lapisan transparan dengan efek blur dan gambar lebih gelap */}
        <div
          className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"
          style={{ zIndex: 0 }}
        />

        {/* Konten lainnya */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 py-8 mx-auto w-full md:h-screen lg:py-0">
          <div
            className="relative w-full bg-white rounded-lg shadow max-w-md xl:p-0"
            style={{
              backgroundColor: '#FFFFFF', // Menambahkan warna putih eksplisit
              borderRadius: '1rem', // Membuat kotak putih bagian atas menjadi rounded
            }}
          >
            {/* Logo */}
            <div className="flex items-center px-3 py-3 bg-white rounded-t-lg">
              <Image
                src="/images/logo/logo_fdokterikan.png"
                alt="Dokter Ikan Logo"
                width={128}
                height={128}
                className="w-15 h-15"
              />
            </div>

            {/* Tombol silang */}
            <button
              onClick={handleBackToHome}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-lg">
                Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="relative w-full">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      id="password"
                      value={password}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 text-gray-500"
                      style={{ top: '50%', transform: 'translateY(-50%)' }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-start">
                  <a
                    href="/forgotpassword"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center"
                  disabled={loading} // Disable tombol saat loading
                >
                  {loading ? 'Signing In...' : 'Sign In'} {/* Tampilkan teks loading */}
                </button>
                <p className="text-sm font-light text-gray-500">
                  Don’t have an account yet?{' '}
                  <a href="/register" className="font-medium text-blue-600 hover:underline">
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer autoClose={2000} hideProgressBar={false} /> {/* Menambahkan ToastContainer */}
    </div>
  );
}