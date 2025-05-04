'use client';

import { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { isAuthenticated, login, getUsers } from '@/utils/authHelpers'; 

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
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

    const { email, password } = formData;

    try {
      if (!email || !password) {
        throw new Error('Por favor, preencha todos os campos');
      }

      const users = getUsers();
      const user = users.find((u) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('E-mail ou senha inválidos');
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      login({
        id: user.id,
        name: user.name,
        email: user.email
      });

      router.push('/home');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputs = [
    {
      id: 'email',
      label: 'E-mail',
      type: 'email',
      placeholder: 'seu@email.com',
      autoComplete: 'email'
    },
    {
      id: 'password',
      label: 'Senha',
      type: showPassword ? 'text' : 'password',
      placeholder: '********',
      autoComplete: 'current-password'
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Entrar</h2>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded" role="alert" aria-live="assertive">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {inputs.map(({ id, label, type, placeholder, autoComplete }) => (
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
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-gray-600">
            Ainda não tem conta?{' '}
            <Link href="/cad-user" className="text-blue-600 hover:text-blue-800 font-medium">
              Cadastre-se
            </Link>
          </p>
          <div className="mt-4">
            <button
              className="text-blue-600 hover:text-blue-800 text-sm"
              onClick={() => {
                const users = getUsers();
                if (users.length === 0) {
                  localStorage.setItem(
                    'users',
                    JSON.stringify([
                      { id: '1', name: 'Usuário Demo', email: 'demo@portal-pcd.com', password: '123456' }
                    ])
                  );
                  alert('Usuário demo criado! Email: demo@portal-pcd.com, Senha: 123456');
                } else {
                  alert('Use o email e senha de um usuário cadastrado ou faça um novo cadastro.');
                }
              }}
            >
              Precisa de ajuda para entrar?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}