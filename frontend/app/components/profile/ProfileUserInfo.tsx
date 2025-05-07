'use client';

import Link from 'next/link';
import { User, Mail, Phone, Calendar, MapPin } from 'lucide-react';

interface User {
  name: string;
  email: string;
  address: string;
  role: string;
  phone_number?: string;
  created_at?: string;
  image?: string;
}

interface ProfileInfoProps {
  user: User;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <label className="block text-gray-900 font-semibold mb-2">Nama Lengkap</label>
          <div className="flex items-center">
            <span className="absolute left-3 text-gray-500">
              <User size={18} />
            </span>
            <input 
              type="text" 
              value={user.name} 
              className="w-full p-3 pl-10 text-gray-900 border rounded-lg bg-white/60 backdrop-blur-md shadow-sm" 
              disabled 
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-gray-900 font-semibold mb-2">Alamat Email</label>
          <div className="flex items-center">
            <span className="absolute left-3 text-gray-500">
              <Mail size={18} />
            </span>
            <input 
              type="email" 
              value={user.email} 
              className="w-full p-3 pl-10 text-gray-900 border rounded-lg bg-white/60 backdrop-blur-md shadow-sm" 
              disabled 
            />
          </div>
          <p className="text-green-600 text-sm mt-1 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Alamat Email Sudah Diverifikasi
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <label className="block text-gray-900 font-semibold mb-2">Nomor HP</label>
          <div className="flex items-center">
            <span className="absolute left-3 text-gray-500">
              <Phone size={18} />
            </span>
            <input 
              type="text" 
              value={user.phone_number || '-'} 
              className="w-full p-3 pl-10 text-gray-900 border rounded-lg bg-white/60 backdrop-blur-md shadow-sm" 
              disabled 
            />
          </div>
        </div>
        
        <div className="relative">
          <label className="block text-gray-900 font-semibold mb-2">Bergabung Sejak</label>
          <div className="flex items-center">
            <span className="absolute left-3 text-gray-500">
              <Calendar size={18} />
            </span>
            <input 
              type="text" 
              value={user.created_at || '-'} 
              className="w-full p-3 pl-10 text-gray-900 border rounded-lg bg-white/60 backdrop-blur-md shadow-sm" 
              disabled 
            />
          </div>
        </div>
      </div>
      
      <div className="relative">
        <label className="block text-gray-900 font-semibold mb-2">Alamat</label>
        <div className="flex items-center">
          <span className="absolute left-3 text-gray-500">
            <MapPin size={18} />
          </span>
          <input 
            type="text" 
            value={user.address || '-'} 
            className="w-full p-3 pl-10 text-gray-900 border rounded-lg bg-white/60 backdrop-blur-md shadow-sm" 
            disabled 
          />
        </div>
      </div>

      <div className="mt-8 text-right">
        <Link href="/edit-profile">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-8 rounded-lg shadow-lg transition duration-300 flex items-center justify-center gap-2 mx-auto md:ml-auto md:mr-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Ubah Data
          </button>
        </Link>
      </div>
    </div>
  );
}