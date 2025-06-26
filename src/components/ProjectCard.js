import React from 'react';
import { 
  MoreHorizontal,
  Clock,
  User,
  DollarSign
} from 'lucide-react';

const ProjectCard = ({ projeto }) => {
  if (!projeto) return null;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {projeto.nome || 'Projeto sem nome'}
          </h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-3">
            <User className="w-4 h-4 mr-1" />
            {projeto.cliente || 'Cliente não informado'}
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              projeto.status === 'Em Andamento' 
                ? 'bg-blue-100 text-blue-800' 
                : projeto.status === 'Concluído'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {projeto.status || 'Status não definido'}
            </span>
            
            {projeto.prioridade && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                projeto.prioridade === 'Alta' 
                  ? 'bg-red-100 text-red-800' 
                  : projeto.prioridade === 'Media'
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {projeto.prioridade}
              </span>
            )}
          </div>

          {projeto.prazo && (
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Clock className="w-4 h-4 mr-1" />
              Prazo: {projeto.prazo}
            </div>
          )}

          {projeto.valor && (
            <div className="flex items-center text-sm font-medium text-gray-900 mb-4">
              <DollarSign className="w-4 h-4 mr-1" />
              R$ {projeto.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          )}

          {projeto.progresso !== undefined && (
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
          )}

          {projeto.tarefas && projeto.tarefas.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Tarefas Recentes</p>
              <div className="space-y-2">
                {projeto.tarefas.slice(0, 3).map((tarefa, index) => (
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
                {projeto.tarefas.length > 3 && (
                  <button className="text-blue-600 text-xs hover:text-blue-500">
                    Ver todas as tarefas ({projeto.tarefas.length})
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        
        <button className="text-gray-400 hover:text-gray-600 ml-4">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;