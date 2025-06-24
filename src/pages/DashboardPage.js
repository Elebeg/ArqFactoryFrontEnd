import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FolderOpen, 
  DollarSign, 
  Calendar,
  Bell,
  Settings,
  MoreHorizontal,
  Clock,
  User,
  FileText,
  BarChart3,
  Building,
  ChevronDown,
  LogOut
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth';
import useDashboard from '../hooks/useDashboard';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const { user, logout, isAuthenticated, token } = useAuth();
  const { totalClientes, projetosAtivos, orcamentosPendentes, projetosRecentes, loading } = useDashboard();
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  // Verificar autenticação ao carregar a página
  useEffect(() => {
    if (!isAuthenticated() || !token) {
      navigate('/login');
    }
  }, [isAuthenticated, token, navigate]);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'cronograma', label: 'Cronograma', icon: Calendar },
    { id: 'orcamentos', label: 'Orçamentos', icon: DollarSign },
    { id: 'projetos', label: 'Projetos', icon: FolderOpen },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'relatorios', label: 'Relatórios', icon: FileText },
    { id: 'configuracoes', label: 'Configurações', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const StatCard = ({ icon: Icon, title, value, color = 'blue' }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg bg-${color}-50 mr-4`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const ProjectCard = ({ projeto }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{projeto.nome}</h3>
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <User className="w-4 h-4 mr-1" />
            {projeto.cliente}
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              projeto.status === 'Em Andamento' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {projeto.status}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              projeto.prioridade === 'Alta' 
                ? 'bg-red-100 text-red-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {projeto.prioridade}
            </span>
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-3">
            <Clock className="w-4 h-4 mr-1" />
            Prazo: {projeto.prazo}
          </div>

          <div className="flex items-center text-sm font-medium text-gray-900 mb-4">
            <DollarSign className="w-4 h-4 mr-1" />
            R$ {projeto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600">Progresso</span>
              <span className="font-medium">{projeto.progresso}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${projeto.progresso}%` }}
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Tarefas Recentes</p>
            <div className="space-y-2">
              {projeto.tarefas.map((tarefa, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    tarefa.status === 'Concluído' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <span className="text-gray-600">{tarefa.nome}</span>
                  <span className={`ml-auto px-2 py-1 rounded text-xs ${
                    tarefa.status === 'Concluído' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {tarefa.status}
                  </span>
                </div>
              ))}
              <button className="text-blue-600 text-xs hover:text-blue-500">
                Ver todas as tarefas (3)
              </button>
            </div>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 ml-4">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderizar nada (será redirecionado)
  if (!isAuthenticated() || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        {/* Logo */}
        <div className="absolute -top-10 left-4 z-20">
          <div className="flex items-center space-x-4">
            <img 
              src="/LogoDesktop.png" 
              alt="ArqFactory" 
              className="w-40 h-40 object-contain" 
            />
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 mt-20">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.label;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.label)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Bem-vindo(a), {user?.firstName}!
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  </div>
                  <span className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
              icon={Users} 
              title="Total de Clientes" 
              value={totalClientes}
              color="blue"
            />
            <StatCard 
              icon={FolderOpen} 
              title="Projetos Ativos" 
              value={projetosAtivos}
              color="green"
            />
            <StatCard 
              icon={DollarSign} 
              title="Orçamentos Pendentes" 
              value={orcamentosPendentes}
              color="orange"
            />
          </div>

          {/* Projects Section */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Projetos Recentes</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projetosRecentes.map((projeto) => (
                <ProjectCard key={projeto.id} projeto={projeto} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;