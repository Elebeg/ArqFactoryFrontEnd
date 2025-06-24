import React, { useState, useEffect } from 'react';
import { Building } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useAPI from '../hooks/useAPI';
import Alert from '../components/Alert';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { makeRequest } = useAPI();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Login component mounted, checking authentication');
    if (isAuthenticated()) {
      console.log('User already authenticated, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleLogin = async (formData, rememberMe) => {
    setLoading(true);
    setError('');
    
    console.log('Iniciando login para:', formData.email);
    console.log('Remember me:', rememberMe);
    
    const { success, data, error: apiError } = await makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
    
    console.log('Resposta do login:', { success, data, apiError });
    
    if (success && data) {
      // Verificar se temos token na resposta
      const token = data.token || data.access_token || data.accessToken;
      
      if (token) {
        // Extrair dados do usuário - verificar diferentes estruturas possíveis
        const userData = {
          id: data.user?.id || data.id,
          firstName: data.user?.firstName || data.firstName || data.user?.first_name || data.first_name,
          lastName: data.user?.lastName || data.lastName || data.user?.last_name || data.last_name,
          email: data.user?.email || data.email || formData.email,
          cpf: data.user?.cpf || data.cpf
        };
        
        console.log('Dados do usuário extraídos:', userData);
        console.log('Token extraído:', token.substring(0, 50) + '...');
        
        // Fazer login no contexto
        login(userData, token, rememberMe);
        
        setSuccess('Login realizado com sucesso!');
        
        // Aguardar um pouco para mostrar a mensagem de sucesso
        setTimeout(() => {
          console.log('Navigating to dashboard');
          navigate('/dashboard');
        }, 1000);
      } else {
        console.error('Token não encontrado na resposta:', data);
        setError('Erro na resposta do servidor: token não encontrado');
      }
    } else {
      console.error('Erro no login:', { success, data, apiError });
      
      // Melhor tratamento de erros
      let errorMessage = 'Erro ao fazer login';
      
      if (apiError) {
        errorMessage = apiError;
      } else if (data?.message) {
        errorMessage = data.message;
      } else if (data?.error) {
        errorMessage = data.error;
      }
      
      setError(errorMessage);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-calmBlue-400 via-calmBlue-500 to-calmBlue-600 flex">
      {/* Lado esquerdo - Informações */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center text-white p-12 relative overflow-hidden">
        {/* Overlay sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20"></div>
        
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-16 left-16 w-24 h-24 bg-white/5 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute bottom-20 right-16 w-40 h-40 bg-white/3 rounded-full blur-md"></div>
        <div className="absolute top-1/3 right-24 w-20 h-20 bg-white/8 rounded-full blur-sm"></div>
        <div className="absolute bottom-1/3 left-20 w-16 h-16 bg-white/6 rounded-full blur-sm"></div>
        
        {/* Header com logo no topo */}
        <div className="absolute -top-10 left-4 z-20">
          <div className="flex items-center space-x-4">
            <img 
              src="/LogoDesktop.png" 
              alt="ArqFactory" 
              className="w-40 h-40 object-contain filter brightness-0 invert" 
            />
          </div>
        </div>

        <div className="relative z-10 text-center max-w-lg space-y-8">
          {/* Conteúdo principal */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-light tracking-wide">
                Bem-vindo de volta
              </h1>
              <p className="text-xl text-white/80 font-light leading-relaxed">
                Continue transformando ideias em realidade
              </p>
            </div>
          </div>

          {/* Card principal */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Acesse sua conta</h3>
              <p className="text-white/80 leading-relaxed">
                Seus projetos e toda sua criatividade estão esperando por você. 
                Entre e continue de onde parou.
              </p>
            </div>
          </div>

          {/* Estatísticas elegantes */}
          <div className="grid grid-cols-1 gap-4 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-light mb-1">10.000+</div>
              <div className="text-sm text-white/70 font-light">Projetos realizados</div>
            </div>
            <div className="flex justify-center space-x-8 text-sm text-white/70">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-white/60 rounded-full mr-2"></div>
                Arquitetos especializados
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-white/60 rounded-full mr-2"></div>
                Suporte dedicado
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-2">
            <img src="/LogoMobile.png" alt="Logo ArqFactory" className="w-40 h-40 mx-auto mb-4 object-contain" />
          </div>
          {/* Alertas */}
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}
          <LoginForm onLogin={handleLogin} loading={loading} />
          <div className="mt-4 text-center">
            <button
              className="text-sm text-calmBlue-600 hover:text-calmBlue-500 underline"
              onClick={() => navigate('/register')}
            >
              Não tem uma conta? Cadastre-se
            </button>
          </div>
          {/* Footer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Ao continuar, você concorda com nossos{' '}
              <button className="text-calmBlue-600 hover:text-calmBlue-500 underline">
                Termos de Uso
              </button>{' '}
              e{' '}
              <button className="text-calmBlue-600 hover:text-calmBlue-500 underline">
                Política de Privacidade
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;