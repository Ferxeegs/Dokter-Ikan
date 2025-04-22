'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error('Terjadi kesalahan, coba lagi!');
      toast.success('Link reset password telah dikirim ke email!');
    } catch {
      toast.error('Terjadi kesalahan, coba lagi!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Forgot Password</title>
        <meta name="description" content="Forgot Password Page" />
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
        <div
          className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"
          style={{ zIndex: 0 }}
        />

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

            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-lg">
                Forgot Your Password?
              </h1>
              <p className="text-sm text-gray-600">Enter your email and we will send you a password reset link.</p>
              <form className="space-y-4 md:space-y-6" onSubmit={handleForgotPassword}>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  disabled={loading}
                >
                  {loading ? 'Mengirim...' : 'Kirim Link Reset'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default ForgotPassword;