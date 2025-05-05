import { FormEvent, ChangeEvent } from 'react';

interface AuthFormProps {
  inputs: Array<{
    id: string;
    label: string;
    type: string;
    placeholder: string;
    value: string;
    autoComplete?: string;
    isPassword?: boolean;
  }>;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  loading?: boolean;
  showPassword?: boolean;
  togglePasswordVisibility?: () => void;
  submitText: string;
}

export default function AuthForm({
  inputs,
  onSubmit,
  onChange,
  error,
  loading,
  showPassword,
  togglePasswordVisibility,
  submitText
}: AuthFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {inputs.map((input) => (
        <div key={input.id} className="mb-6">
          <label htmlFor={input.id} className="block text-gray-700 font-medium mb-2">
            {input.label}
          </label>
          <div className="relative">
            <input
              id={input.id}
              name={input.id}
              type={input.isPassword ? (showPassword ? 'text' : 'password') : input.type}
              placeholder={input.placeholder}
              value={input.value}
              onChange={onChange}
              autoComplete={input.autoComplete}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 text-gray-700 focus:ring-blue-500 outline-none transition-colors"
            />
            {input.isPassword && togglePasswordVisibility && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
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
        className={`w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors ${
          loading ? 'opacity-70 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Processando...' : submitText}
      </button>
    </form>
  );
}