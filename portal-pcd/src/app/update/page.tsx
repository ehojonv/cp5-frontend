'use client';

import { useState, FormEvent, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAuthUser, updateUser, isAuthenticated } from '@/utils/authHelpers';

export default function Update() {
  interface ProfileFormData {
    name: string;
    email: string;
  }
  
  interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }
  
  interface FormState {
    error: string;
    success: string;
    loading: boolean;
    showPassword: boolean;
    changePassword: boolean;
    userId: string | null;
  }
  const [profileData, setProfileData] = useState<ProfileFormData>({
    name: '',
    email: ''
  });
  
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  // Group UI state in a single object
  const [formState, setFormState] = useState<FormState>({
    error: '',
    success: '',
    loading: false,
    showPassword: false,
    changePassword: false,
    userId: null
  });
  
  const router = useRouter();

  useEffect(() => {
    // Authentication check
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Get user data and populate form
    const user = getAuthUser();
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email
      });
      
      setFormState(prev => ({
        ...prev,
        userId: user.id
      }));
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleInputChange = <T extends Record<string, any>>(
    e: ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<T>>,
  ) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleInputChange<ProfileFormData>(e, setProfileData);
  };
  
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleInputChange<PasswordFormData>(e, setPasswordData);
  };

  const togglePasswordChange = () => {
    setFormState(prev => {
      const newChangePassword = !prev.changePassword;
      
      if (newChangePassword) {
        return { ...prev, changePassword: true };
      } else {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        return { ...prev, changePassword: false };
      }
    });
  };
  
  const togglePasswordVisibility = () => {
    setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const validatePasswordRequirements = (password: string): boolean => {
    return password.length >= 6;
  };
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setFormState(prev => ({
      ...prev,
      loading: true,
      error: '',
      success: ''
    }));

    const { name, email } = profileData;
    const { userId, changePassword } = formState;
    const { currentPassword, newPassword, confirmNewPassword } = passwordData;

    try {
      if (!userId) {
        throw new Error('Usuário não identificado. Por favor, faça login novamente.');
      }

      if (!name || !email) {
        throw new Error('Nome e e-mail são obrigatórios');
      }

      if (!validateEmail(email)) {
        throw new Error('Por favor, insira um e-mail válido');
      }

      let updateSuccessful = false;
      

      if (changePassword) {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
          throw new Error('Todos os campos de senha são obrigatórios');
        }

        if (newPassword !== confirmNewPassword) {
          throw new Error('As novas senhas não coincidem');
        }

        if (!validatePasswordRequirements(newPassword)) {
          throw new Error('A nova senha deve ter pelo menos 6 caracteres');
        }

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === userId);
        
        if (userIndex === -1) {
          throw new Error('Usuário não encontrado');
        }

        if (users[userIndex].password !== currentPassword) {
          throw new Error('Senha atual incorreta');
        }

        updateSuccessful = updateUser(userId, { 
          name, 
          email, 
          password: newPassword 
        });
      } else {

        updateSuccessful = updateUser(userId, { name, email });
      }
      
      if (!updateSuccessful) {
        throw new Error('Falha ao atualizar usuário');
      }


      await new Promise(resolve => setTimeout(resolve, 800));
      

      setFormState(prev => ({ 
        ...prev, 
        success: 'Perfil atualizado com sucesso!',
        changePassword: false
      }));
      

      if (changePassword) {
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      }
      
    } catch (err: any) {
      setFormState(prev => ({ ...prev, error: err.message }));
    } finally {
      setFormState(prev => ({ ...prev, loading: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 flex flex-col justify-center items-center p-4">
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Atualizar Perfil</h2>

          {formState.error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded" role="alert" aria-live="assertive">
              <p className="text-red-700">{formState.error}</p>
            </div>
          )}

          {formState.success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded" role="alert" aria-live="assertive">
              <p className="text-green-700">{formState.success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {[
              {
                id: 'name',
                label: 'Nome completo',
                type: 'text',
                placeholder: 'Seu nome',
                value: profileData.name,
                autoComplete: 'name'
              },
              {
                id: 'email',
                label: 'E-mail',
                type: 'email',
                placeholder: 'seu@email.com',
                value: profileData.email,
                autoComplete: 'email'
              }
            ].map((field) => (
              <div className="mb-6" key={field.id}>
                <label htmlFor={field.id} className="block text-gray-700 font-medium mb-2">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={handleProfileChange}
                  autoComplete={field.autoComplete}
                  aria-required="true"
                  className="w-full px-4 py-3 rounded-lg border text-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            ))}

            <div className="mb-6">
              <div className="flex items-center mb-4">
                <input
                  id="changePassword"
                  type="checkbox"
                  checked={formState.changePassword}
                  onChange={togglePasswordChange}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="changePassword" className="ml-2 block text-gray-700 font-medium">
                  Alterar senha
                </label>
              </div>

              {formState.changePassword && (
                <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                  {[
                    {
                      id: 'currentPassword',
                      label: 'Senha atual',
                      placeholder: 'Digite sua senha atual',
                      value: passwordData.currentPassword
                    },
                    {
                      id: 'newPassword',
                      label: 'Nova senha',
                      placeholder: 'Mínimo 6 caracteres',
                      value: passwordData.newPassword
                    },
                    {
                      id: 'confirmNewPassword',
                      label: 'Confirmar nova senha',
                      placeholder: 'Confirme sua nova senha',
                      value: passwordData.confirmNewPassword
                    }
                  ].map((field) => (
                    <div key={field.id}>
                      <label htmlFor={field.id} className="block text-gray-700 font-medium mb-2">
                        {field.label}
                      </label>
                      <div className="relative">
                        <input
                          id={field.id}
                          name={field.id}
                          type={formState.showPassword ? 'text' : 'password'}
                          placeholder={field.placeholder}
                          value={field.value}
                          onChange={handlePasswordChange}
                          className="w-full px-4 py-3 rounded-lg border text-gray-700 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label={formState.showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {formState.showPassword ? 'Ocultar' : 'Mostrar'} senha
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={formState.loading}
                className={`flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-4 focus:ring-blue-300 ${formState.loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                aria-busy={formState.loading}
              >
                {formState.loading ? 'Salvando...' : 'Salvar alterações'}
              </button>
              
              <Link 
                href="/home" 
                className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors text-center focus:outline-none focus:ring-4 focus:ring-gray-200"
              >
                Voltar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}