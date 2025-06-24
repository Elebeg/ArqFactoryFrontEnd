import { useAuth } from './useAuth';

const useAPI = () => {
  const { token, logout } = useAuth();
  const API_BASE_URL = 'https://arqfactorybackend-production.up.railway.app';

  const makeRequest = async (endpoint, options = {}) => {
    try {
      // Usar token do contexto primeiro, depois do localStorage como fallback
      const authToken = token || localStorage.getItem('authToken');
      
      console.log('makeRequest to:', endpoint);
      console.log('Token available:', authToken ? 'yes' : 'no');
      
      const defaultHeaders = {
        'Content-Type': 'application/json',
      };

      // Adicionar Authorization header se o token existir
      if (authToken) {
        defaultHeaders.Authorization = `Bearer ${authToken}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        ...options,
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      // Verificar se a resposta tem conteúdo JSON
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        // Se não for JSON, tentar ler como texto
        const textData = await response.text();
        console.log('Response text:', textData);
        
        // Se a resposta estiver vazia mas o status for ok, considerar sucesso
        if (response.ok && (!textData || textData.trim() === '')) {
          data = { success: true };
        } else {
          // Tentar fazer parse do JSON mesmo assim
          try {
            data = JSON.parse(textData);
          } catch (e) {
            data = { message: textData || 'Resposta inválida do servidor' };
          }
        }
      }

      console.log('Parsed data:', data);

      // Se o token for inválido (401), fazer logout apenas se estivermos em uma rota protegida
      if (response.status === 401) {
        console.log('Received 401 - Unauthorized');
        
        // Não fazer logout automático aqui, deixar o ProtectedRoute lidar com isso
        // O logout será feito apenas quando necessário
        const errorMessage = data?.message || data?.error || 'Sessão expirada. Faça login novamente.';
        return { success: false, error: errorMessage, statusCode: 401 };
      }

      // Verificar se a resposta é de sucesso
      if (response.ok) {
        return { success: true, data };
      } else {
        // Status de erro HTTP
        const errorMessage = data?.message || data?.error || `Erro HTTP ${response.status}`;
        return { success: false, error: errorMessage, data, statusCode: response.status };
      }

    } catch (error) {
      console.error('API Error:', error);
      
      // Verificar se é erro de rede
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        return { success: false, error: 'Erro de conexão. Verifique sua internet e tente novamente.' };
      }
      
      return { success: false, error: 'Erro de conexão. Tente novamente.' };
    }
  };

  const makeAuthenticatedRequest = async (endpoint, options = {}) => {
    // Usar token do contexto primeiro
    const authToken = token || localStorage.getItem('authToken');
    
    console.log('makeAuthenticatedRequest to:', endpoint);
    console.log('Auth token available:', authToken ? 'yes' : 'no');
    
    if (!authToken) {
      console.log('No token found for authenticated request');
      return { success: false, error: 'Token não encontrado. Faça login novamente.', statusCode: 401 };
    }

    const result = await makeRequest(endpoint, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${authToken}`,
      },
    });

    // Se recebemos 401 em uma requisição autenticada, o token provavelmente expirou
    if (result.statusCode === 401) {
      console.log('Token expired or invalid in authenticated request');
      // Aqui podemos fazer logout se necessário
      // logout();
    }

    return result;
  };

  return { makeRequest, makeAuthenticatedRequest };
};

export default useAPI;