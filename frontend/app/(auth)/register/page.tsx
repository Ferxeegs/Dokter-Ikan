'use client'

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify'; // Import notifikasi
import 'react-toastify/dist/ReactToastify.css'; // Gaya notifikasi

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Fungsi untuk menangani perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  // Fungsi untuk menangani pengiriman formulir
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Membuat payload data untuk dikirim ke API
    const data = {
      name,
      email,
      password
    };

    try {
      const response = await fetch('http://localhost:9000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('User registered successfully:', result);
        toast.success('Registration successful! Please Login');
        setTimeout(() => {
          router.push('/login'); // Arahkan ke halaman utama setelah 2 detik
        }, 2000);  // Menampilkan notifikasi sukses
      } else {
        const result = await response.json();
        // Menampilkan notifikasi error dengan pesan dari server
        if (result.message) {
          toast.error(result.message); 
        } else {
          toast.error('Registration failed, please try again.');
        }
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Error occurred during registration.'); // Menampilkan notifikasi error
    }
  };

  return (
    <div>
      <Head>
        <title>Register</title>
        <meta name="description" content="Register Page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
  
      <section
        className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: "url('/homebg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'top',
        }}
      >
        {/* Lapisan transparan hanya untuk latar belakang */}
        <div
          className="absolute inset-0 bg-white opacity-20"
          style={{ zIndex: 0 }}
        />
  
        {/* Konten lainnya */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 py-8 mx-auto w-full md:h-screen lg:py-0">
          <div
            className="relative w-full bg-white rounded-lg shadow max-w-md xl:p-0"
            style={{
              backgroundColor: '#FFFFFF', // Menambahkan warna putih eksplisit
            }}
          >
            {/* Logo */}
            <div className="flex items-center px-4 py-2 bg-white">
              <img
                src="/icon512.png"
                alt="Dokter Ikan Logo"
                className="w-8 h-8"
              />
              <img
                src="/icondokterikan.png"
                alt="Dokter Ikan Text Logo"
                className="w-15 h-6 ml-2"
              />
            </div>
  
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-lg">
                Sign up for an account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={name}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Sign up
                </button>
                <p className="text-sm font-light text-gray-500">
                  Already have an account?{' '}
                  <a
                    href="/login"
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Sign in
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer autoClose={2000} hideProgressBar={false} />
    </div>
  );
}
