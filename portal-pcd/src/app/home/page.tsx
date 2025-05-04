'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface MenuItem {
  label: string;
  href: string;
  action?: () => void;
}

export default function Home() {
  const router = useRouter();

  // Proteção de rota: redireciona para login se não autenticado
  useEffect(() => {
    const hasCookie = document.cookie
      .split(';')
      .some(item => item.trim().startsWith('auth-token='));
    if (!hasCookie) {
      router.push('/login');
    }
  }, [router]);

  // Obtém informações do usuário a partir do cookie
  const tokenCookie = document.cookie
    .split(';')
    .find(item => item.trim().startsWith('auth-token='));
  const user = tokenCookie
    ? JSON.parse(decodeURIComponent(tokenCookie.split('=')[1]))
    : null;

  const handleLogout = () => {
    // Expira o cookie para logout
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/login');
  };

  // Itens do menu inicial
  const menuItems: MenuItem[] = [
    { label: 'Listagem de Serviços', href: '/listagem' },
    { label: 'Atualizar Perfil', href: '/update' },
    { label: 'Logout', href: '/login', action: handleLogout }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      {/* Cabeçalho */}
      <header className="max-w-4xl mx-auto flex items-center justify-between py-6">
        <div className="flex items-center space-x-3">
          <div className="relative h-12 w-12">
            <Image
              src="/images/logo.png"
              alt="Portal PCD Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-blue-800">Portal PCD</h1>
        </div>
        {user && (
          <div className="text-gray-700">
            Olá, <span className="font-medium">{user.name}</span>
          </div>
        )}
      </header>

      {/* Menu Principal */}
      <main className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
        {menuItems.map(item => (
          item.action ? (
            <button
              key={item.label}
              onClick={item.action}
              className="bg-white rounded-xl shadow-lg p-6 text-center font-medium hover:bg-gray-50 transition"
            >
              {item.label}
            </button>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className="block bg-white rounded-xl shadow-lg p-6 text-center font-medium hover:bg-gray-50 transition"
            >
              {item.label}
            </Link>
          )
        ))}
      </main>
    </div>
  );
}
