import { useState, useEffect, createContext, useContext } from 'react';

// Context para autenticação
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se existe token no localStorage na inicialização
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('userData');
    
    console.log('AuthProvider init - Token:', savedToken ? 'exists' : 'not found');
    console.log('AuthProvider init - User:', savedUser ? 'exists' : 'not found');
    
    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(parsedUser);
        console.log('Auth state restored from localStorage');
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        // Limpar dados corrompidos
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken, rememberMe = true) => {
    console.log('Login called with:', { userData, token: authToken, rememberMe });
    
    setUser(userData);
    setToken(authToken);
    
    // Sempre salvar no localStorage para manter a sessão
    // O rememberMe pode ser usado para outras funcionalidades se necessário
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    console.log('Auth state updated and saved to localStorage');
  };

  const logout = () => {
    console.log('Logout called');
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    console.log('Auth state cleared');
  };

  const isAuthenticated = () => {
    const hasToken = token !== null;
    const hasUser = user !== null;
    const result = hasToken && hasUser;
    console.log('isAuthenticated check:', { hasToken, hasUser, result });
    return result;
  };

  const getAuthHeaders = () => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    console.log('getAuthHeaders:', headers);
    return headers;
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    getAuthHeaders,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};