import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import useAPI from '../hooks/useAPI';
import { useNavigate } from 'react-router-dom';
import { useDashboardContext } from '../contexts/DashboardContext';

// Componentes
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Alert from '../components/Alert';

// Ícones
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Building2,
  User,
  MoreVertical,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  FileText,
  DollarSign
} from 'lucide-react';

const ClientesPage = () => {
  const { isAuthenticated, token } = useAuth();
  const { makeAuthenticatedRequest } = useAPI();
  const { triggerDashboardRefresh } = useDashboardContext();
  const navigate = useNavigate();

  // Estados
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create', 'edit', 'view'
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cnpj: '',
    address: ''
  });

  // Verificar autenticação
  useEffect(() => {
    if (!isAuthenticated() || !token) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, token, navigate]);

  // Carregar clientes
  useEffect(() => {
    if (isAuthenticated() && token) {
      fetchClientes();
    }
  }, [isAuthenticated, token]);

  // Filtrar clientes
  useEffect(() => {
    let filtered = [...clientes];

    // Filtro por status
    if (filterStatus === 'ativos') {
      filtered = filtered.filter(cliente => cliente.isActive);
    } else if (filterStatus === 'inativos') {
      filtered = filtered.filter(cliente => !cliente.isActive);
    }

    // Filtro por busca
    if (searchTerm && searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(cliente =>
        (cliente.name && cliente.name.toLowerCase().includes(search)) ||
        (cliente.email && cliente.email.toLowerCase().includes(search)) ||
        (cliente.phone && cliente.phone.includes(searchTerm)) ||
        (cliente.cpf && cliente.cpf.includes(searchTerm)) ||
        (cliente.cnpj && cliente.cnpj.includes(searchTerm))
      );
    }

    setClientesFiltrados(filtered);
  }, [clientes, searchTerm, filterStatus]);

  // Auto-hide alerts
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await makeAuthenticatedRequest('/clients');
      
      console.log('Fetch clientes result:', result);
      
      if (result.success) {
        const clientesData = result.data || [];
        setClientes(clientesData);
        setClientesFiltrados(clientesData);
      } else {
        const errorMsg = result.error || 'Erro ao carregar clientes';
        setError(errorMsg);
        console.error('Erro ao buscar clientes:', errorMsg);
      }
    } catch (error) {
      console.error('Erro na requisição de clientes:', error);
      setError('Erro de conexão ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.name || !formData.name.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    if (!formData.phone || !formData.phone.trim()) {
      setError('Telefone é obrigatório');
      return;
    }

    // Validar email se fornecido
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Formato de email inválido');
        return;
      }
    }

    try {
      setSubmitLoading(true);
      setError('');
      
      // Limpar dados vazios
      const cleanedData = Object.keys(formData).reduce((acc, key) => {
        const value = formData[key];
        if (value && value.trim && value.trim() !== '') {
          acc[key] = value.trim();
        } else if (value && !value.trim) {
          acc[key] = value;
        }
        return acc;
      }, {});

      console.log('Dados a serem enviados:', cleanedData);
      
      const endpoint = modalType === 'edit' ? `/clients/${selectedCliente.id}` : '/clients';
      const method = modalType === 'edit' ? 'PATCH' : 'POST';
      
      const result = await makeAuthenticatedRequest(endpoint, {
        method,
        body: JSON.stringify(cleanedData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Submit result:', result);
      
      if (result.success) {
        setSuccess(`Cliente ${modalType === 'edit' ? 'atualizado' : 'criado'} com sucesso!`);
        setShowModal(false);
        resetForm();
        await fetchClientes(); // Recarregar a lista
        
        // Disparar atualização do dashboard
        triggerDashboardRefresh();
      } else {
        const errorMsg = result.error || `Erro ao ${modalType === 'edit' ? 'atualizar' : 'criar'} cliente`;
        setError(errorMsg);
        console.error('Erro no submit:', errorMsg);
      }
    } catch (error) {
      console.error('Erro no submit:', error);
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (clienteId) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const result = await makeAuthenticatedRequest(`/clients/${clienteId}`, {
        method: 'DELETE'
      });
      
      if (result.success) {
        setSuccess('Cliente excluído com sucesso!');
        await fetchClientes();
        
        // Disparar atualização do dashboard
        triggerDashboardRefresh();
      } else {
        const errorMsg = result.error || 'Erro ao excluir cliente';
        setError(errorMsg);
      }
    } catch (error) {
      console.error('Erro ao excluir:', error);
      setError('Erro de conexão ao excluir cliente');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (clienteId) => {
    try {
      setError('');
      
      const result = await makeAuthenticatedRequest(`/clients/${clienteId}/toggle-active`, {
        method: 'PATCH'
      });
      
      if (result.success) {
        setSuccess('Status do cliente alterado com sucesso!');
        await fetchClientes();
        
        // Disparar atualização do dashboard (importante quando mudamos status de ativo/inativo)
        triggerDashboardRefresh();
      } else {
        const errorMsg = result.error || 'Erro ao alterar status do cliente';
        setError(errorMsg);
      }
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      setError('Erro de conexão ao alterar status');
    }
  };

  const openModal = (type, cliente = null) => {
    setModalType(type);
    setSelectedCliente(cliente);
    setError('');
    setSuccess('');
    
    if (type === 'edit' && cliente) {
      setFormData({
        name: cliente.name || '',
        email: cliente.email || '',
        phone: cliente.phone || '',
        cpf: cliente.cpf || '',
        cnpj: cliente.cnpj || '',
        address: cliente.address || ''
      });
    } else if (type === 'create') {
      resetForm();
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('create');
    setSelectedCliente(null);
    resetForm();
    setError('');
    setSuccess('');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      cpf: '',
      cnpj: '',
      address: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Funções de formatação
  const formatPhone = (phone) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const formatCPF = (cpf) => {
    if (!cpf) return '';
    const cleaned = cpf.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
    }
    return cpf;
  };

  const formatCNPJ = (cnpj) => {
    if (!cnpj) return '';
    const cleaned = cnpj.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
    }
    return cnpj;
  };

  // Se não estiver autenticado, não renderizar nada
  if (!isAuthenticated() || !token) {
    return null;
  }

  if (loading && clientes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        
        <div className="flex-1 flex flex-col">
          <Header />
          
          <main className="flex-1 p-6">
            {/* Header da Página */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Users className="w-8 h-8 text-blue-600 mr-3" />
                    Clientes
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Gerencie sua base de clientes e contatos
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => openModal('create')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Cliente
                  </button>
                </div>
              </div>
            </div>

            {/* Alertas */}
            {error && (
              <Alert 
                type="error" 
                message={error} 
                onClose={() => setError('')}
              />
            )}
            {success && (
              <Alert 
                type="success" 
                message={success} 
                onClose={() => setSuccess('')}
              />
            )}

            {/* Filtros e Busca */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Busca */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por nome, email, telefone, CPF ou CNPJ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filtro por Status */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                  >
                    <option value="todos">Todos os clientes</option>
                    <option value="ativos">Apenas ativos</option>
                    <option value="inativos">Apenas inativos</option>
                  </select>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-end space-x-4 text-sm text-gray-600">
                  <span>Total: {clientes.length}</span>
                  <span>Filtrados: {clientesFiltrados.length}</span>
                </div>
              </div>
            </div>

            {/* Lista de Clientes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              {clientesFiltrados.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contato
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Documento
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Projetos
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {clientesFiltrados.map((cliente) => (
                        <tr key={cliente.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                {cliente.cnpj ? (
                                  <Building2 className="w-5 h-5 text-blue-600" />
                                ) : (
                                  <User className="w-5 h-5 text-blue-600" />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {cliente.name}
                                </div>
                                {cliente.address && (
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {cliente.address.length > 30 ? cliente.address.substring(0, 30) + '...' : cliente.address}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              {cliente.email && (
                                <div className="text-sm text-gray-900 flex items-center">
                                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                  {cliente.email}
                                </div>
                              )}
                              <div className="text-sm text-gray-900 flex items-center">
                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                {formatPhone(cliente.phone)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="space-y-1">
                              {cliente.cpf && (
                                <div className="text-sm text-gray-900">
                                  CPF: {formatCPF(cliente.cpf)}
                                </div>
                              )}
                              {cliente.cnpj && (
                                <div className="text-sm text-gray-900">
                                  CNPJ: {formatCNPJ(cliente.cnpj)}
                                </div>
                              )}
                              {!cliente.cpf && !cliente.cnpj && (
                                <span className="text-sm text-gray-400">-</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleActive(cliente.id)}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                cliente.isActive
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {cliente.isActive ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Ativo
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Inativo
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-1" />
                                {cliente.projects?.length || 0}
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {cliente.budgets?.length || 0}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => openModal('view', cliente)}
                                className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                title="Visualizar"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openModal('edit', cliente)}
                                className="text-yellow-600 hover:text-yellow-900 p-1 rounded"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(cliente.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || filterStatus !== 'todos' 
                      ? 'Nenhum cliente encontrado' 
                      : 'Nenhum cliente cadastrado'
                    }
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || filterStatus !== 'todos'
                      ? 'Tente ajustar os filtros para encontrar o que procura.'
                      : 'Comece adicionando seu primeiro cliente.'
                    }
                  </p>
                  {!searchTerm && filterStatus === 'todos' && (
                    <button
                      onClick={() => openModal('create')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Adicionar Cliente
                    </button>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {modalType === 'create' && 'Novo Cliente'}
                {modalType === 'edit' && 'Editar Cliente'}
                {modalType === 'view' && 'Detalhes do Cliente'}
              </h3>
            </div>
            
            <div className="p-6">
              {/* Alertas no Modal */}
              {error && (
                <div className="mb-4">
                  <Alert 
                    type="error" 
                    message={error} 
                    onClose={() => setError('')}
                  />
                </div>
              )}

              {modalType === 'view' ? (
                // Visualização do cliente
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      {selectedCliente?.cnpj ? (
                        <Building2 className="w-8 h-8 text-blue-600" />
                      ) : (
                        <User className="w-8 h-8 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-900">{selectedCliente?.name}</h4>
                      <p className="text-gray-500">
                        {selectedCliente?.cnpj ? 'Pessoa Jurídica' : 'Pessoa Física'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Informações de Contato</h5>
                      <div className="space-y-2">
                        {selectedCliente?.email && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" />
                            {selectedCliente.email}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          {formatPhone(selectedCliente?.phone)}
                        </div>
                        {selectedCliente?.address && (
                          <div className="flex items-start text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                            {selectedCliente.address}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-3">Documentos</h5>
                      <div className="space-y-2">
                        {selectedCliente?.cpf && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">CPF:</span> {formatCPF(selectedCliente.cpf)}
                          </div>
                        )}
                        {selectedCliente?.cnpj && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">CNPJ:</span> {formatCNPJ(selectedCliente.cnpj)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-3">Status e Dados</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-900">
                          {selectedCliente?.isActive ? 'Ativo' : 'Inativo'}
                        </div>
                        <div className="text-xs text-gray-500">Status</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">
                          {selectedCliente?.projects?.length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Projetos</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-emerald-600">
                          {selectedCliente?.budgets?.length || 0}
                        </div>
                        <div className="text-xs text-gray-500">Orçamentos</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-lg font-bold text-gray-600">
                          {selectedCliente?.createdAt 
                            ? new Date(selectedCliente.createdAt).toLocaleDateString('pt-BR')
                            : '-'
                          }
                        </div>
                        <div className="text-xs text-gray-500">Cadastro</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Formulário de criação/edição
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nome completo ou razão social"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="email@exemplo.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="(11) 99999-9999"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CPF
                      </label>
                      <input
                        type="text"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="000.000.000-00"
                        maxLength="14"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CNPJ
                      </label>
                      <input
                        type="text"
                        name="cnpj"
                        value={formData.cnpj}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="00.000.000/0000-00"
                        maxLength="18"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Endereço
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Endereço completo"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {submitLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {modalType === 'edit' ? 'Atualizando...' : 'Salvando...'}
                        </>
                      ) : (
                        <>
                          {modalType === 'edit' ? 'Atualizar' : 'Salvar'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ClientesPage;