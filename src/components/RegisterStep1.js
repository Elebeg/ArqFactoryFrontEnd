import React, { useState } from 'react';
import { User, Mail } from 'lucide-react';
import CustomInput from './CustomInput';
import LoadingButton from './LoadingButton';
import useValidation from '../hooks/useValidation';

const RegisterStep1 = ({ formData, onChange, onNext }) => {
  const { validateEmail } = useValidation();
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nome é obrigatório';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Criar Conta</h2>
        <p className="text-gray-600">Junte-se à nossa comunidade</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <CustomInput
          label="Nome"
          value={formData.firstName}
          onChange={(e) => onChange({...formData, firstName: e.target.value})}
          placeholder="João"
          icon={User}
          required
          error={errors.firstName}
        />
        <CustomInput
          label="Sobrenome"
          value={formData.lastName}
          onChange={(e) => onChange({...formData, lastName: e.target.value})}
          placeholder="Silva"
          required
          error={errors.lastName}
        />
      </div>
      <CustomInput
        label="E-mail"
        type="email"
        value={formData.email}
        onChange={(e) => onChange({...formData, email: e.target.value})}
        placeholder="joao.silva@email.com"
        icon={Mail}
        required
        error={errors.email}
      />
      <LoadingButton onClick={handleNext}>
        <div className="flex items-center justify-center">
          Continuar
          <span className="ml-2">→</span>
        </div>
      </LoadingButton>
    </div>
  );
};

export default RegisterStep1; 