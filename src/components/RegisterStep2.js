import React, { useState } from 'react';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';
import CustomInput from './CustomInput';
import LoadingButton from './LoadingButton';
import PasswordStrength from './PasswordStrength';
import useValidation from '../hooks/useValidation';

const RegisterStep2 = ({ formData, onChange, onBack, onSubmit, loading }) => {
  const { formatCPF, validateCPF, validatePassword } = useValidation();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = 'Senha não atende aos critérios';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-4">
      <CustomInput
        label="CPF"
        value={formData.cpf}
        onChange={(e) => onChange({...formData, cpf: formatCPF(e.target.value)})}
        placeholder="000.000.000-00"
        icon={CreditCard}
        maxLength={14}
        required
        error={errors.cpf}
      />
      <CustomInput
        label="Senha"
        value={formData.password}
        onChange={(e) => onChange({...formData, password: e.target.value})}
        placeholder="Mín. 8 caracteres"
        icon={Lock}
        required
        showPasswordToggle
        showPassword={showPassword}
        onTogglePassword={() => setShowPassword(!showPassword)}
        error={errors.password}
      />
      <CustomInput
        label="Confirmar Senha"
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => onChange({...formData, confirmPassword: e.target.value})}
        placeholder="Confirme sua senha"
        icon={Lock}
        required
        error={errors.confirmPassword}
      />
      <PasswordStrength password={formData.password} />
      <div className="flex space-x-3">
        <LoadingButton onClick={onBack} variant="secondary">
          <div className="flex items-center justify-center">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Voltar
          </div>
        </LoadingButton>
        <LoadingButton loading={loading} onClick={handleSubmit}>
          Criar Conta
        </LoadingButton>
      </div>
    </div>
  );
};

export default RegisterStep2; 