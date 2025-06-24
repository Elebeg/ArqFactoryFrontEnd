import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import useAPI from '../hooks/useAPI';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user, logout, token } = useAuth();
  const { makeAuthenticatedRequest } = useAPI();
  const [verifying, setVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      console.log('ProtectedRoute - Starting token verification');
      console.log('isAuthenticated:', isAuthenticated());
      console.log('user:', user);
      console.log('token available:', token ? 'yes' : 'no');

      if (!isAuthenticated()) {
        console.log('User not authenticated, skipping verification');
        setVerifying(false);
        return;
      }

      try {
        // Usar o endpoint /auth/profile que existe no backend para verificar se o token é válido
        console.log('Making auth verification request to /auth/profile');
        const { success, data, error } = await makeAuthenticatedRequest('/auth/profile', {
          method: 'GET'
        });

        console.log('Verification result:', { success, data, error });

        if (success && data) {
          console.log('Token is valid, user profile retrieved');
          setIsValidToken(true);
          
          // Opcional: atualizar os dados do usuário se necessário
          // Se os dados retornados forem diferentes dos salvos localmente
          if (data.email && data.email !== user?.email) {
            console.log('Updating user data from profile endpoint');
            // Aqui você pode atualizar o contexto se necessário
          }
        } else {
          console.error('Token inválido ou erro na verificação:', error);
          
          // Se o erro for 401 (token inválido/expirado), fazer logout
          if (error && error.includes('401')) {
            console.log('Token expired or invalid (401), logging out');
            logout();
            setIsValidToken(false);
          } else {
            // Para outros erros, assumir que o token ainda é válido
            // (pode ser erro temporário de rede)
            console.log('Non-auth error, assuming token is still valid');
            setIsValidToken(true);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar token:', error);
        // Para erros de rede, não fazer logout automaticamente
        // Assumir que o token ainda é válido
        console.log('Network error during verification, assuming token is valid');
        setIsValidToken(true);
      } finally {
        setVerifying(false);
      }
    };

    // Só verificar se temos os dados básicos
    if (!loading) {
      verifyToken();
    }
  }, [isAuthenticated, makeAuthenticatedRequest, logout, user, token, loading]);

  console.log('ProtectedRoute render state:', {
    loading,
    verifying,
    isAuthenticated: isAuthenticated(),
    isValidToken,
    user: user ? 'exists' : 'null'
  });

  // Mostrar loading enquanto está carregando os dados iniciais ou verificando token
  if (loading || verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado ou token for inválido, redirecionar para login
  if (!isAuthenticated() || !isValidToken) {
    console.log('Redirecting to login - Auth:', isAuthenticated(), 'Valid token:', isValidToken);
    return <Navigate to="/login" replace />;
  }

  console.log('Rendering protected content');
  return children;
};

export default ProtectedRoute;