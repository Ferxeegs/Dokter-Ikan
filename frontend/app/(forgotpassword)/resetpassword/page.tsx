'use client';

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter, useSearchParams } from 'next/navigation';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const emailFromParams = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!token || !emailFromParams) {
      toast.error('Token tidak valid!');
      router.push('/forgot-password');
    }
  }, [token, emailFromParams, router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Password dan konfirmasi password tidak cocok!');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailFromParams, token: searchParams.get('token'), newPassword: password }),
      });
      if (!response.ok) throw new Error('Gagal mereset password, coba lagi!');
      toast.success('Password berhasil diubah!');
      router.push('/login');
    } catch (error) {
      toast.error('Gagal mereset password, coba lagi!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Reset Password</title>
        <meta name="description" content="Reset Password Page" />
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
        <div className="absolute inset-0 bg-white opacity-20" style={{ zIndex: 0 }} />

        <div className="relative z-10 flex flex-col items-center justify-center px-6 py-8 mx-auto w-full md:h-screen lg:py-0">
          <div className="relative w-full bg-white rounded-lg shadow max-w-md xl:p-0">
            <div className="flex items-center px-3 py-3 bg-white">
              <img src="/images/logo/logo_dokterikan512.png" alt="Dokter Ikan Logo" className="w-10 h-10" />
              <img src="/images/logo/logo_dokterikan.png" alt="Dokter Ikan Logo" className="w-15 h-6" />
            </div>

            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-lg">
                Reset Your Password
              </h1>
              <p className="text-sm text-gray-600">Enter a new password for your account.</p>
              <form className="space-y-4 md:space-y-6" onSubmit={handleResetPassword}>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <AiOutlineEyeInvisible size={20} color="black" /> : <AiOutlineEye size={20} color="black" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <AiOutlineEyeInvisible size={20} color="black" /> : <AiOutlineEye size={20} color="black" />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  disabled={loading}
                >
                  {loading ? 'Menyimpan...' : 'Reset Password'}
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

export default ResetPassword;