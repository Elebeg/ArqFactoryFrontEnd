import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  FolderOpen, 
  DollarSign, 
  Calendar,
  FileText,
  BarChart3,
  Settings,
  Home,
  Building2,
  Compass,
  ChevronLeft,
  ChevronRight,
  Briefcase
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      color: 'blue',
      description: 'Visão geral dos projetos',
      path: '/dashboard'
    },
    { 
      id: 'projetos', 
      label: 'Projetos', 
      icon: Building2, 
      color: 'emerald',
      description: 'Gerenciar projetos arquitetônicos',
      path: '/projetos'
    },
    { 
      id: 'clientes', 
      label: 'Clientes', 
      icon: Users, 
      color: 'purple',
      description: 'Base de clientes e contatos',
      path: '/clientes'
    },
    { 
      id: 'orcamentos', 
      label: 'Orçamentos', 
      icon: DollarSign, 
      color: 'orange',
      description: 'Propostas e orçamentos',
      path: '/orcamentos'
    },
    { 
      id: 'cronograma', 
      label: 'Cronograma', 
      icon: Calendar, 
      color: 'teal',
      description: 'Planejamento e prazos',
      path: '/cronograma'
    },
    { 
      id: 'portfolio', 
      label: 'Portfólio', 
      icon: Compass, 
      color: 'pink',
      description: 'Galeria de projetos concluídos',
      path: '/portfolio'
    },
    { 
      id: 'relatorios', 
      label: 'Relatórios', 
      icon: BarChart3, 
      color: 'indigo',
      description: 'Análises e métricas',
      path: '/relatorios'
    }
  ];

  const bottomMenuItems = [
    { 
      id: 'configuracoes', 
      label: 'Configurações', 
      icon: Settings, 
      color: 'gray',
      description: 'Preferências do sistema',
      path: '/configuracoes'
    }
  ];

  const handleItemClick = (item) => {
    navigate(item.path);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const MenuItem = ({ item, isBottom = false }) => {
    const Icon = item.icon;
    const isActive = isActiveRoute(item.path);
    const isHovered = hoveredItem === item.id;

    return (
      <div className="relative">
        <button
          onClick={() => handleItemClick(item)}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          className={`
            w-full flex items-center transition-all duration-200 rounded-xl group relative
            ${isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3'}
            ${isActive 
              ? `bg-gradient-to-r from-${item.color}-50 to-${item.color}-100 text-${item.color}-700 shadow-lg border-l-4 border-${item.color}-500` 
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }
          `}
        >
          <div className={`
            p-2 rounded-lg transition-all duration-200
            ${isActive 
              ? `bg-${item.color}-500 text-white shadow-md` 
              : `group-hover:bg-${item.color}-100 group-hover:text-${item.color}-600`
            }
          `}>
            <Icon className="w-5 h-5" />
          </div>
          
          {!isCollapsed && (
            <div className="ml-3 flex-1 text-left">
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
              )}
            </div>
          )}

          {isActive && !isCollapsed && (
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          )}
        </button>

        {/* Tooltip para sidebar colapsada */}
        {isCollapsed && isHovered && (
          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 z-50">
            <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap shadow-xl">
              <div className="font-medium">{item.label}</div>
              <div className="text-xs text-gray-300 mt-1">{item.description}</div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`
      bg-white shadow-xl border-r border-gray-100 transition-all duration-300 relative
      ${isCollapsed ? 'w-20' : 'w-72'}
      flex flex-col h-full
    `}>
      {/* Header com Logo */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/3 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className={`relative z-10 transition-all duration-300 ${isCollapsed ? 'p-4' : 'p-6'}`}>
          {!isCollapsed ? (
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/dashboard')}
            >
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <img 
                  src="/LogoDesktop.png" 
                  alt="ArqFactory" 
                  className="object-contain filter brightness-0 invert" 
                />
              </div>
              <div>
                <h2 className="text-xl font-bold">ArqFactory</h2>
                <p className="text-blue-100 text-sm">Gestão Arquitetônica</p>
              </div>
            </div>
          ) : (
            <div 
              className="flex justify-center cursor-pointer hover:scale-105 transition-transform"
              onClick={() => navigate('/dashboard')}
            >
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <img 
                  src="/LogoDesktop.png" 
                  alt="ArqFactory" 
                  className="object-contain filter brightness-0 invert" 
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {!isCollapsed && (
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div 
              className="bg-white rounded-lg p-3 text-center shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/projetos')}
            >
              <div className="text-lg font-bold text-blue-600">24</div>
              <div className="text-xs text-gray-500">Projetos</div>
            </div>
            <div 
              className="bg-white rounded-lg p-3 text-center shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate('/relatorios')}
            >
              <div className="text-lg font-bold text-emerald-600">87%</div>
              <div className="text-xs text-gray-500">Conclusão</div>
            </div>
          </div>
        </div>
      )}

      {/* Menu Principal */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className={`${!isCollapsed ? 'mb-6' : 'mb-4'}`}>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Menu Principal
            </h3>
          )}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      </nav>

      {/* Menu Inferior */}
      <div className="p-4 border-t border-gray-100">
        {!isCollapsed && (
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Sistema
          </h3>
        )}
        <div className="space-y-1">
          {bottomMenuItems.map((item) => (
            <MenuItem key={item.id} item={item} isBottom={true} />
          ))}
        </div>
      </div>

      {/* User Status */}
      {!isCollapsed && (
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Sistema Online</p>
              <p className="text-xs text-gray-500">Todos os serviços funcionando</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;