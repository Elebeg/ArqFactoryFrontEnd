import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import CustomInput from './CustomInput';
import LoadingButton from './LoadingButton';

const LoginForm = ({ onLogin, loading }) => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(formData, rememberMe);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Bem-vindo de volta!</h2>
        <p className="text-gray-600">Entre para continuar seus projetos</p>
      </div>
      <div className="space-y-4">
        <CustomInput
          label="E-mail ou CPF"
          type="text"
          value={formData.identifier}
          onChange={(e) => setFormData({...formData, identifier: e.target.value})}
          placeholder="seu@email.com ou CPF"
          icon={Mail}
          required
        />
        <CustomInput
          label="Senha"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          placeholder="Sua senha"
          icon={Lock}
          required
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
            Lembrar-me
          </label>
        </div>
        <button type="button" className="text-sm calmBlue-600 hover:text-calmBlue-500">
          Esqueceu sua senha?
        </button>
      </div>
      <LoadingButton loading={loading} onClick={handleSubmit}>
        <div className="flex items-center justify-center">
          Entrar
          <ArrowRight className="ml-2 h-5 w-5" />
        </div>
      </LoadingButton>
    </div>
  );
};

export default LoginForm; 