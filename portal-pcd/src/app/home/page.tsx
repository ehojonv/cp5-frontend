'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAuthUser, logout, isAuthenticated } from '@/utils/authHelpers';

export default function Home() {
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const user = getAuthUser();
    if (user) {
      setUserName(user.name);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="flex justify-center mb-3">
            <div className="relative h-20 w-20">
              <Image 
                src="/images/logo.png"
                alt="Portal PCD Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-blue-800">Bem-vindo(a), {userName}</h1>
          <p className="text-gray-600 mt-2">Escolha uma opção para continuar:</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <Link 
            href="/listagem"
            className="block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors font-medium"
          >
            Listagem de Serviços
          </Link>
          <Link 
            href="/update"
            className="block bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors font-medium"
          >
            Atualizar Perfil
          </Link>
          <button
            onClick={handleLogout}
            className="col-span-1 sm:col-span-2 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg transition-colors font-medium"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}