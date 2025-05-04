'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { saveUser } from '@/utils/authHelpers';

export default function CadUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    // Usando document.cookie ao invés de js-cookie
    const hasCookie = document.cookie.split(';').some(item => item.trim().startsWith('auth-token='));
    if (hasCookie) {
      router.push('/home');
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validações básicas
      if (!name || !email || !password || !confirmPassword) {
        throw new Error('Por favor, preencha todos os campos');
      }

      if (password !== confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Por favor, insira um e-mail válido');
      }

      // Simular um pequeno delay para dar feedback visual
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Gerar ID único
      const userId = Date.now().toString();
      
      // Salvar usuário
      saveUser({
        id: userId,
        name,
        email,
        password
      });
      
      // Criar cookie de autenticação (expira em 1 dia)
      const tokenValue = JSON.stringify({
        id: userId,
        name,
        email
      });
      // Definir expiração para 1 dia a partir de agora
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1);
      document.cookie = `auth-token=${encodeURIComponent(tokenValue)}; expires=${expirationDate.toUTCString()}; path=/`;
      
      // Redirecionar para a home
      router.push('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e cabeçalho */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="relative h-16 w-16">
              <Image 
                src="/images/logo.png" 
                alt="Portal PCD Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-blue-800">Portal PCD</h1>
          <p className="text-gray-600 mt-2">Acessibilidade e Informação</p>
        </div>

        {/* Card de Cadastro */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Criar Conta</h2>
          
          {error && (
            <div 
              className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded" 
              role="alert"
              aria-live="assertive"
            >
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-6">
              <label 
                htmlFor="name" 
                className="block text-gray-700 font-medium mb-2"
              >
                Nome completo
              </label>
              <input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                aria-required="true"
                autoComplete="name"
              />
            </div>

            <div className="mb-6">
              <label 
                htmlFor="email" 
                className="block text-gray-700 font-medium mb-2"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                aria-required="true"
                autoComplete="email"
              />
            </div>
            
            <div className="mb-6">
              <label 
                htmlFor="password" 
                className="block text-gray-700 font-medium mb-2"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  aria-required="true"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div className="mb-8">
              <label 
                htmlFor="confirmPassword" 
                className="block text-gray-700 font-medium mb-2"
              >
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                aria-required="true"
                autoComplete="new-password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              aria-busy={loading}
            >
              {loading ? 'Cadastrando...' : 'Criar conta'}
            </button>
          </form>
        </div>
        
        {/* Links adicionais */}
        <div className="text-center">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Fazer login
            </Link>
          </p>
        </div>
      </div>

      {/* Recursos de acessibilidade - atalhos */}
      <div className="fixed bottom-4 right-4">
        <button 
          aria-label="Menu de acessibilidade"
          className="bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
          onClick={() => alert('Menu de acessibilidade - Implementar no futuro')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}