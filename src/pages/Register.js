import React, { useState, useEffect } from 'react';
import { Building } from 'lucide-react';
import useAPI from '../hooks/useAPI';
import Alert from '../components/Alert';
import RegisterStep1 from '../components/RegisterStep1';
import RegisterStep2 from '../components/RegisterStep2';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cpf: '',
    password: '',
    confirmPassword: ''
  });
  const { makeRequest } = useAPI();
  const navigate = useNavigate();

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleRegister = async (formData) => {
    setLoading(true);
    setError('');
    const registerData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      cpf: formData.cpf.replace(/\D/g, ''),
      password: formData.password,
    };
    const { success, data, error: apiError } = await makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    });
    if (success) {
      setSuccess('Cadastro realizado com sucesso!');
      setTimeout(() => {
        alert('Redirecionando para o dashboard...');
      }, 1500);
    } else {
      setError(apiError || data?.message || 'Erro ao criar conta');
    }
    setLoading(false);
  };

  const resetForm = () => {
    setStep(1);
    setError('');
    setSuccess('');
    setRegisterForm({
      firstName: '',
      lastName: '',
      email: '',
      cpf: '',
      password: '',
      confirmPassword: ''
    });
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
                Comece sua jornada
              </h1>
              <p className="text-xl text-white/80 font-light leading-relaxed">
                Junte-se à maior comunidade de arquitetura do Brasil
              </p>
            </div>
          </div>

          {/* Card principal */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl">
            <div className="space-y-4">
              <h3 className="text-xl font-medium">Crie sua conta</h3>
              <p className="text-white/80 leading-relaxed">
                Transforme suas ideias em projetos incríveis. 
                Conecte-se com profissionais e clientes de todo o país.
              </p>
            </div>
          </div>

          {/* Benefícios elegantes */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 text-center">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="text-2xl font-light mb-1">10.000+</div>
                <div className="text-sm text-white/70 font-light">Projetos na plataforma</div>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                <span>Profissionais qualificados e verificados</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <div className="w-1.5 h-1.5 bg-white/60 rounded-full"></div>
                <span>Ferramentas completas de gestão</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <img src="/LogoMobile.png" alt="Logo ArqFactory" className="w-20 h-20 mx-auto mb-4 object-contain" />
          </div>
          {/* Alertas */}
          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}
          {step === 1 ? (
            <RegisterStep1
              formData={registerForm}
              onChange={setRegisterForm}
              onNext={() => setStep(2)}
            />
          ) : (
            <RegisterStep2
              formData={registerForm}
              onChange={setRegisterForm}
              onBack={() => setStep(1)}
              onSubmit={handleRegister}
              loading={loading}
            />
          )}
          <div className="mt-4 text-center">
            <button
              className="text-sm text-calmBlue-600 hover:text-calmBlue-500 underline"
              onClick={() => navigate('/login')}
            >
              Já tem uma conta? Faça login
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

export default Register;