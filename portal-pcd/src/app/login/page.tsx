'use client';

import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getUsers } from '@/utils/authHelpers';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.cookie.split(';').some(item => item.trim().startsWith('auth-token=')) && router.push('/home');
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { email, password } = formData;
    if (!email || !password) {
      setError('Preencha todos os campos');
      setLoading(false);
      return;
    }

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      setError('E-mail ou senha inválidos');
      setLoading(false);
      return;
    }

    const token = JSON.stringify({ id: user.id, name: user.name, email: user.email });
    const expires = new Date(); expires.setDate(expires.getDate() + 1);
    document.cookie = `auth-token=${encodeURIComponent(token)}; expires=${expires.toUTCString()}; path=/`;
    router.push('/home');
  };

  const inputs = [
    { id: 'email', type: 'email', label: 'E-mail', placeholder: 'seu@email.com', autoComplete: 'email' },
    { id: 'password', type: showPassword ? 'text' : 'password', label: 'Senha', placeholder: 'Digite sua senha', autoComplete: 'current-password' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="flex justify-center">
            <Image 
              src="/images/logo.png" 
              alt="Logo" 
              width={64} 
              height={64} 
              className="mx-auto"
            />
          </div>
          <h1 className="text-3xl font-bold text-blue-800 mt-2">Portal PCD</h1>
          <p className="text-gray-600 mt-2">Acessibilidade e Informação</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6 text-blue-800">Fazer Login</h2>
          <AuthForm
            inputs={inputs.map(input => ({ ...input, value: formData[input.id as keyof typeof formData], isPassword: input.id === 'password' }))}
            onSubmit={handleSubmit}
            onChange={handleChange}
            error={error}
            loading={loading}
            showPassword={showPassword}
            togglePasswordVisibility={() => setShowPassword(prev => !prev)}
            submitText="Entrar"
          />
        </div>
        <p className="text-center text-gray-600 mt-4">
          Ainda não tem conta?{' '}
          <Link href="/cad-user" className="text-blue-600 font-medium">Criar conta</Link>
        </p>
      </div>
    </div>
  );
}