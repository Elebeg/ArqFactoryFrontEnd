import { useState, useEffect } from 'react';

const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalClientes: 0,
    projetosAtivos: 0,
    orcamentosPendentes: 0,
    projetosRecentes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simular carregamento por um breve momento
    const loadMockData = () => {
      setLoading(true);
      
      // Simular delay de carregamento
      setTimeout(() => {
        
        setLoading(false);
        setError(null);
      }, 1000); // 1 segundo de delay para simular carregamento
    };

    loadMockData();
  }, []);

  const refreshDashboard = () => {
    setLoading(true);
    setError(null);
    
  };

  return {
    ...dashboardData,
    loading,
    error,
    refreshDashboard
  };
};

export default useDashboard;