'use client';

import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Image from 'next/image';

export default function Register() {
  const [email, setEmail] = useState('');
  const [otp_code, setOtp] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Email, Step 2: OTP, Step 3: Registration
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'otp') setOtp(value);
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Step 1: Kirim OTP ke email
  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/start-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        toast.success('OTP sent to your email!');
        setStep(2); // Pindah ke step input OTP
      } else {
        toast.error('Failed to send OTP. Try again.');
      }
    } catch {
      toast.error('Error sending OTP.');
    }
  };

  // Step 2: Verifikasi OTP
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp_code }),
      });
      if (response.ok) {
        toast.success('OTP verified!');
        setStep(3); // Pindah ke step input data tambahan
      } else {
        toast.error('Invalid OTP. Try again.');
      }
    } catch {
      toast.error('Error verifying OTP.');
    }
  };

  // Step 3: Registrasi user setelah verifikasi berhasil
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/complete-registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        toast.success('Registration successful! Please Login');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        toast.error('Registration failed. Try again.');
      }
    } catch {
      toast.error('Error during registration.');
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

            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-lg">
                Sign up for an account
              </h1>
              {step === 1 && (
                <form onSubmit={handleSendVerificationCode}>
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
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center mt-4"
                  >
                    Send OTP
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleVerifyCode}>
                  <div className="text-sm text-gray-600 mb-4">
                    Please check your email for the OTP code.
                  </div>
                  <div>
                    <label
                      htmlFor="otp"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      name="otp"
                      id="otp"
                      value={otp_code}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Verify OTP
                  </button>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleSubmit}>
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={name}
                      onChange={handleChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Enter your username"
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
                    <div className="relative w-full">
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full mt-4 text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 text-center"
                  >
                    Register
                  </button>
                </form>
              )}

              <p className="text-sm font-light text-gray-500">
                Already have an account?{' '}
                <a
                  href="/login"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
      <ToastContainer autoClose={2000} hideProgressBar={false} />
    </div>
  );
}