import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import useDashboard from '../hooks/useDashboard';
import { useNavigate } from 'react-router-dom';

// Componentes
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardStats from '../components/DashboardStats';
import ProjectCard from '../components/ProjectCard';
import Footer from '../components/Footer';

const DashboardPage = () => {
  const { isAuthenticated, token } = useAuth();
  const { 
    totalClientes, 
    projetosAtivos, 
    orcamentosPendentes, 
    projetosRecentes, 
    loading, 
    error 
  } = useDashboard();
  
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const navigate = useNavigate();

  // Verificar autenticação ao carregar a página
  useEffect(() => {
    if (!isAuthenticated() || !token) {
      navigate('/login');
    }
  }, [isAuthenticated, token, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderizar nada (será redirecionado)
  if (!isAuthenticated()) {
    return null;
  }

  const dashboardStats = {
    totalClientes,
    projetosAtivos,
    orcamentosPendentes
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Dashboard Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />

          {/* Dashboard Content */}
          <main className="flex-1 p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Stats Cards */}
            <DashboardStats stats={dashboardStats} />

            {/* Projects Section */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Projetos Recentes</h2>
              
              {projetosRecentes && projetosRecentes.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projetosRecentes.map((projeto) => (
                    <ProjectCard key={projeto.id} projeto={projeto} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
                  <p className="text-gray-500">Nenhum projeto encontrado</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Os projetos aparecerão aqui quando forem criados
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Footer - Full Width */}
      <Footer />
    </div>
  );
};

export default DashboardPage;