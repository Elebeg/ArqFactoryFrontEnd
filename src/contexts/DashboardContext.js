import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerDashboardRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DashboardContext.Provider value={{ 
      refreshTrigger, 
      triggerDashboardRefresh 
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext deve ser usado dentro de um DashboardProvider');
  }
  return context;
};