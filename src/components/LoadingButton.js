import React from 'react';

const LoadingButton = ({ loading, onClick, children, variant = 'primary', type = 'button', disabled }) => {
  const baseClasses = "w-full py-3 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  const variants = {
    primary: "bg-gradient-to-r from-calmBlue-400 to-calmBlue-600 text-white hover:from-calmBlue-500 hover:to-calmBlue-600 focus:ring-calmBlue-500",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500"
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Processando...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton; 