import React from 'react';
import useValidation from '../hooks/useValidation';

const PasswordStrength = ({ password }) => {
  const { validatePassword } = useValidation();
  const validation = validatePassword(password);

  const CheckItem = ({ isValid, text }) => (
    <li className={`flex items-center ${isValid ? 'text-green-600' : 'text-gray-400'}`}>
      <span className="mr-2">{isValid ? '✓' : '•'}</span>
      {text}
    </li>
  );

  return (
    <div className="text-xs bg-gray-50 p-3 rounded-lg">
      <p className="font-medium text-gray-700 mb-2">Sua senha deve conter:</p>
      <ul className="space-y-1">
        <CheckItem isValid={validation.checks.minLength} text="Pelo menos 8 caracteres" />
        <CheckItem isValid={validation.checks.hasUpper} text="1 letra maiúscula" />
        <CheckItem isValid={validation.checks.hasLower} text="1 letra minúscula" />
        <CheckItem isValid={validation.checks.hasNumber} text="1 número" />
        <CheckItem isValid={validation.checks.hasSpecial} text="1 caractere especial" />
      </ul>
    </div>
  );
};

export default PasswordStrength; 