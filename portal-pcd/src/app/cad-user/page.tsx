'use client';

import { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { saveUser } from '@/utils/authHelpers';

export default function CadUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hasCookie = document.cookie.split(';').some(item => item.trim().startsWith('auth-token='));
    if (hasCookie) {
      router.push('/home');
    }
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { name, email, password, confirmPassword } = formData;

    try {
      if (!name || !email || !password || !confirmPassword) {
        throw new Error('Por favor, preencha todos os campos');
      }

      if (password !== confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Por favor, insira um e-mail válido');
      }

      await new Promise(resolve => setTimeout(resolve, 800));
      const userId = Date.now().toString();

      saveUser({ id: userId, name, email, password });

      const tokenValue = JSON.stringify({ id: userId, name, email });
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1);
      document.cookie = `auth-token=${encodeURIComponent(tokenValue)}; expires=${expirationDate.toUTCString()}; path=/`;

      router.push('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputs = [
    {
      id: 'name',
      type: 'text',
      label: 'Nome completo',
      placeholder: 'Seu nome',
      autoComplete: 'name'
    },
    {
      id: 'email',
      type: 'email',
      label: 'E-mail',
      placeholder: 'seu@email.com',
      autoComplete: 'email'
    },
    {
      id: 'password',
      type: showPassword ? 'text' : 'password',
      label: 'Senha',
      placeholder: 'Mínimo 6 caracteres',
      autoComplete: 'new-password'
    },
    {
      id: 'confirmPassword',
      type: showPassword ? 'text' : 'password',
      label: 'Confirmar senha',
      placeholder: 'Confirme sua senha',
      autoComplete: 'new-password'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
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

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Criar Conta</h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded" role="alert" aria-live="assertive">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {inputs.map(({ id, type, label, placeholder, autoComplete }) => (
              <div className="mb-6" key={id}>
                <label htmlFor={id} className="block text-gray-700 font-medium mb-2">
                  {label}
                </label>
                <div className="relative">
                  <input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    value={formData[id as keyof typeof formData]}
                    onChange={handleChange}
                    autoComplete={autoComplete}
                    aria-required="true"
                    className="w-full px-4 py-3 rounded-lg border text-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                  {id === 'password' && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? 'Ocultar' : 'Mostrar'}
                    </button>
                  )}
                </div>
              </div>
            ))}

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

        <div className="text-center">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
