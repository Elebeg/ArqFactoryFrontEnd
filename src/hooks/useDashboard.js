import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import useAPI from './useAPI';

const useDashboard = () => {
  const { isAuthenticated } = useAuth();
  const { makeAuthenticatedRequest } = useAPI();
  const [dashboardData, setDashboardData] = useState({
    totalClientes: 0,
    projetosAtivos: 0,
    orcamentosPendentes: 0,
    projetosRecentes: [],
    loading: true,
    error: null
  });

  const fetchDashboardData = async () => {
    if (!isAuthenticated()) {
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: 'Usuário não autenticado'
      }));
      return;
    }

    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));

      // Buscar dados do dashboard usando requisição autenticada
      const { success, data, error } = await makeAuthenticatedRequest('/dashboard/stats', {
        method: 'GET'
      });

      if (success) {
        setDashboardData({
          totalClientes: data.totalClientes || 0,
          projetosAtivos: data.projetosAtivos || 0,
          orcamentosPendentes: data.orcamentosPendentes || 0,
          projetosRecentes: data.projetosRecentes || [],
          loading: false,
          error: null
        });
      } else {
        // Dados mock caso a API não esteja disponível ou retorne erro
        console.warn('API não disponível, usando dados mock:', error);
        setDashboardData({
          totalClientes: 2,
          projetosAtivos: 2,
          orcamentosPendentes: 1,
          projetosRecentes: [
            {
              id: 1,
              nome: 'Projeto Residencial',
              cliente: 'João Silva',
              status: 'Em Andamento',
              prioridade: 'Alta',
              prazo: '30/12/2024',
              valor: 150000.00,
              progresso: 65,
              tarefas: [
                { nome: 'Planta Baixa', status: 'Concluído' },
                { nome: 'Projeto Elétrico', status: 'Em Andamento' }
              ]
            },
            {
              id: 2,
              nome: 'Reforma Comercial',
              cliente: 'Maria Santos',
              status: 'Pendente',
              prioridade: 'Média',
              prazo: '14/10/2024',
              valor: 80000.00,
              progresso: 30,
              tarefas: [
                { nome: 'Levantamento', status: 'Concluído' },
                { nome: 'Orçamento', status: 'Em Andamento' }
              ]
            }
          ],
          loading: false,
          error: null
        });
      }
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: 'Erro de conexão'
      }));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [isAuthenticated]);

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    ...dashboardData,
    refreshData
  };
};

export default useDashboard;