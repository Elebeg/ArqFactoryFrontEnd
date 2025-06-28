import { useState, useEffect } from 'react';
import useAPI from './useAPI';
import { useAuth } from './useAuth';
import { useDashboardContext } from '../contexts/DashboardContext';

const useDashboard = () => {
  const { makeAuthenticatedRequest } = useAPI();
  const { isAuthenticated, token } = useAuth();
  const { refreshTrigger } = useDashboardContext();
  
  const [dashboardData, setDashboardData] = useState({
    totalClientes: 0,
    projetosAtivos: 0,
    orcamentosPendentes: 0,
    projetosRecentes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados dos clientes
      const clientsResult = await makeAuthenticatedRequest('/clients');
      
      let totalClientes = 0;
      if (clientsResult.success && clientsResult.data) {
        // Contar apenas clientes ativos
        totalClientes = clientsResult.data.filter(client => client.isActive).length;
      }

      // Buscar dados dos projetos
      const projectsResult = await makeAuthenticatedRequest('/projects');
      
      let projetosAtivos = 0;
      let projetosRecentes = [];
      if (projectsResult.success && projectsResult.data) {
        // Contar projetos ativos
        projetosAtivos = projectsResult.data.filter(project => 
          project.status === 'ativo' || project.status === 'em_andamento'
        ).length;
        
        // Pegar os 4 projetos mais recentes
        projetosRecentes = projectsResult.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 4);
      }

      // Buscar dados dos orçamentos
      const budgetsResult = await makeAuthenticatedRequest('/budgets');
      
      let orcamentosPendentes = 0;
      if (budgetsResult.success && budgetsResult.data) {
        // Contar orçamentos pendentes
        orcamentosPendentes = budgetsResult.data.filter(budget => 
          budget.status === 'pendente' || budget.status === 'aguardando'
        ).length;
      }

      setDashboardData({
        totalClientes,
        projetosAtivos,
        orcamentosPendentes,
        projetosRecentes
      });

    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated() && token) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token, refreshTrigger]); // Adicionar refreshTrigger como dependência

  const refreshDashboard = () => {
    if (isAuthenticated() && token) {
      fetchDashboardData();
    }
  };

  return {
    ...dashboardData,
    loading,
    error,
    refreshDashboard,
    fetchDashboardData // Expor para uso externo
  };
};

export default useDashboard;