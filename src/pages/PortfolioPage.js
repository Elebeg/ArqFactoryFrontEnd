import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading portfolio items
    setTimeout(() => {
      setPortfolio([
        {
          id: 1,
          title: 'Casa Moderna',
          description: 'Residência contemporânea com design minimalista e funcional',
          category: 'Residencial',
          area: '250m²',
          location: 'São Paulo, SP',
          completionDate: '2024-03-15',
          image: '/api/images/casa-moderna.jpg',
          features: ['3 quartos', '2 banheiros', 'Cozinha integrada', 'Área gourmet']
        },
        {
          id: 2,
          title: 'Apartamento Minimalista',
          description: 'Apartamento com acabamento de alto padrão e design clean',
          category: 'Residencial',
          area: '120m²',
          location: 'São Paulo, SP',
          completionDate: '2024-02-28',
          image: '/api/images/apartamento-minimalista.jpg',
          features: ['2 quartos', '2 banheiros', 'Varanda gourmet', 'Home office']
        },
        {
          id: 3,
          title: 'Escritório Corporativo',
          description: 'Espaço de trabalho moderno e funcional para empresa de tecnologia',
          category: 'Comercial',
          area: '500m²',
          location: 'São Paulo, SP',
          completionDate: '2023-12-15',
          image: '/api/images/escritorio-corporativo.jpg',
          features: ['Open space', 'Sala de reuniões', 'Cafeteria', 'Área de lazer']
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Portfólio</h1>
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                Novo Projeto
              </button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map(item => (
                  <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <div className="text-gray-500 text-center">
                        <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm">Imagem do projeto</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Área:</span>
                          <span className="font-medium">{item.area}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Localização:</span>
                          <span className="font-medium">{item.location}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Conclusão:</span>
                          <span className="font-medium">
                            {new Date(item.completionDate).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Características:</h4>
                        <div className="flex flex-wrap gap-1">
                          {item.features.map((feature, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded transition duration-200">
                          Ver Detalhes
                        </button>
                        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium py-2 px-3 rounded transition duration-200">
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PortfolioPage; 