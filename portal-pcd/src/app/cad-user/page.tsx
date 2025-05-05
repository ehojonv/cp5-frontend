'use client';

import { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { saveUser } from '@/utils/authHelpers';
import AuthForm from '@/components/AuthForm';

export default function CadUser() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { name, email, password, confirmPassword } = formData;
    if (!name || !email || !password || !confirmPassword) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um e-mail válido');
      setLoading(false);
      return;
    }
    await new Promise(res => setTimeout(res, 800));
    const userId = Date.now().toString();
    saveUser({ id: userId, name, email, password });
    const token = JSON.stringify({ id: userId, name, email });
    const expires = new Date(); expires.setDate(expires.getDate() + 1);
    document.cookie = `auth-token=${encodeURIComponent(token)}; expires=${expires.toUTCString()}; path=/`;
    router.push('/home');
  };

  const inputs = [
    { id: 'name', type: 'text', label: 'Nome completo', placeholder: 'Seu nome', autoComplete: 'name' },
    { id: 'email', type: 'email', label: 'E-mail', placeholder: 'seu@email.com', autoComplete: 'email' },
    { id: 'password', type: showPassword ? 'text' : 'password', label: 'Senha', placeholder: 'Mínimo 6 caracteres', autoComplete: 'new-password' },
    { id: 'confirmPassword', type: showPassword ? 'text' : 'password', label: 'Confirmar senha', placeholder: 'Confirme sua senha', autoComplete: 'new-password' }
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
          <h2 className="text-2xl font-semibold mb-6 text-blue-800">Criar Conta</h2>
          <AuthForm
            inputs={inputs.map(input => ({ ...input, value: formData[input.id as keyof typeof formData], isPassword: input.id.toLowerCase().includes('password') }))}
            onSubmit={handleSubmit}
            onChange={handleChange}
            error={error}
            loading={loading}
            showPassword={showPassword}
            togglePasswordVisibility={() => setShowPassword(prev => !prev)}
            submitText="Criar conta"
          />
        </div>
        <p className="text-center text-gray-600 mt-4">
          Já tem conta?{' '}
          <Link href="/login" className="text-blue-600 font-medium">Fazer login</Link>
        </p>
      </div>
    </div>
  );
}