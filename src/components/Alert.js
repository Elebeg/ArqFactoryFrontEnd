import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const Alert = ({ type, message }) => {
  const isError = type === 'error';
  const bgColor = isError ? 'bg-red-50' : 'bg-green-50';
  const borderColor = isError ? 'border-red-200' : 'border-green-200';
  const textColor = isError ? 'text-red-800' : 'text-green-800';
  const Icon = isError ? AlertCircle : CheckCircle;

  return (
    <div className={`mb-6 ${bgColor} border ${borderColor} ${textColor} px-4 py-3 rounded-lg flex items-center`}>
      <Icon className="w-5 h-5 mr-2" />
      <span className="text-sm">{message}</span>
    </div>
  );
};

export default Alert; 