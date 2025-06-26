import React from 'react';
import { 
  Users, 
  FolderOpen, 
  DollarSign 
} from 'lucide-react';

const StatCard = ({ icon: Icon, title, value, color = 'blue' }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
    <div className="flex items-center">
      <div className={`p-3 rounded-lg bg-${color}-50 mr-4`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value || 0}</p>
      </div>
    </div>
  </div>
);

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard 
        icon={Users} 
        title="Total de Clientes" 
        value={stats?.totalClientes}
        color="blue"
      />
      <StatCard 
        icon={FolderOpen} 
        title="Projetos Ativos" 
        value={stats?.projetosAtivos}
        color="green"
      />
      <StatCard 
        icon={DollarSign} 
        title="Orçamentos Pendentes" 
        value={stats?.orcamentosPendentes}
        color="orange"
      />
    </div>
  );
};

export default DashboardStats;