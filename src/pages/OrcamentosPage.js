import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Upload, 
  FileText, 
  X, 
  Save, 
  Eye, 
  Edit,
  Trash2,
  Download,
  DollarSign,
  Calendar,
  User,
  Building,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';
import useAPI from '../hooks/useAPI';

const OrcamentosPage = () => {
  const { makeAuthenticatedRequest } = useAPI();
  const [activeTab, setActiveTab] = useState('lista');
  const [showForm, setShowForm] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');
  const fileInputRef = useRef(null);

  // Estado do formulário
  const [formData, setFormData] = useState({
    numeroOrcamento: '',
    cliente: '',
    email: '',
    telefone: '',
    endereco: '',
    data: new Date().toISOString().split('T')[0],
    validade: '',
    prazoEntrega: '',
    vendedor: '',
    observacoes: '',
    items: [
      {
        id: 1,
        descricao: '',
        quantidade: 1,
        valorUnitario: 0,
        valorTotal: 0
      }
    ],
    subtotal: 0,
    desconto: 0,
    valorTotal: 0,
    status: 'pendente',
    formaPagamento: '',
    condicoesPagamento: ''
  });

  // Mock data para demonstração
  const [orcamentos] = useState([
    {
      id: 1,
      numero: '94305',
      cliente: 'Maria Eduarda',
      valor: 6385.00,
      data: '2025-05-16',
      status: 'aprovado',
      items: 4
    },
    {
      id: 2,
      numero: '492',
      cliente: 'AMENE STUDIO',
      valor: 5552.00,
      data: '2025-05-16',
      status: 'pendente',
      items: 3
    },
    {
      id: 3,
      numero: '94306',
      cliente: 'João Silva',
      valor: 3200.00,
      data: '2025-05-15',
      status: 'rejeitado',
      items: 2
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantidade' || field === 'valorUnitario') {
            updatedItem.valorTotal = updatedItem.quantidade * updatedItem.valorUnitario;
          }
          return updatedItem;
        }
        return item;
      })
    }));
    
    // Recalcular total
    setTimeout(() => {
      const subtotal = formData.items.reduce((sum, item) => sum + item.valorTotal, 0);
      const total = subtotal - formData.desconto;
      setFormData(prev => ({
        ...prev,
        subtotal,
        valorTotal: total
      }));
    }, 0);
  };

  const addItem = () => {
    const newId = Math.max(...formData.items.map(item => item.id)) + 1;
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: newId,
        descricao: '',
        quantidade: 1,
        valorUnitario: 0,
        valorTotal: 0
      }]
    }));
  };

  const removeItem = (id) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter(item => item.id !== id)
      }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = (file) => {
    if (file.type !== 'application/pdf') {
      alert('Por favor, selecione apenas arquivos PDF.');
      return;
    }

    setUploadedFile(file);
    extractDataFromPDF(file);
  };

  const extractDataFromPDF = async (file) => {
    setIsExtracting(true);
    
    try {
      // Simular extração de dados do PDF
      // Na implementação real, você enviaria o arquivo para o backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dados simulados baseados nos PDFs fornecidos
      const mockExtractedData = {
        numeroOrcamento: '94305',
        cliente: 'MARIA EDUARDA',
        telefone: '(47) 99202-1797',
        endereco: 'RUA 232, Nº 528, ED.PORTO CALI - MEIA PRAIA - ITAPEMA/SC',
        data: '2025-05-16',
        vendedor: 'Kelli Cristina Oliboni',
        prazoEntrega: '20 DIAS ÚTEIS',
        validade: '10 DIAS',
        items: [
          {
            id: 1,
            descricao: 'CONJUNTO DE BOX DE CORRER VIDRO INCOLOR TEMPERADO 8MM + KIT EM ALUMINIO PRETO',
            quantidade: 1,
            valorUnitario: 1387.00,
            valorTotal: 1387.00
          },
          {
            id: 2,
            descricao: 'CONJUNTO DE BOX DE CANTO DE CORRER VIDRO INCOLOR TEMPERADO 8MM + KIT EM ALUMINIO PRETO',
            quantidade: 1,
            valorUnitario: 2009.00,
            valorTotal: 2009.00
          },
          {
            id: 3,
            descricao: 'CONJUNTO DE BOX DE CANTO DE CORRER VIDRO INCOLOR TEMPERADO 8MM + KIT EM ALUMINIO PRETO',
            quantidade: 1,
            valorUnitario: 2044.00,
            valorTotal: 2044.00
          },
          {
            id: 4,
            descricao: 'PUX. ALCA QUADRADO Ø 300 - NEO 20X20 PUXADORES PRETO PERFIL 20 X 20 - 300MM',
            quantidade: 5,
            valorUnitario: 189.00,
            valorTotal: 945.00
          }
        ],
        subtotal: 6385.00,
        valorTotal: 6385.00,
        condicoesPagamento: 'A COMBINAR'
      };

      setExtractedData(mockExtractedData);
      
      // Preencher o formulário com os dados extraídos
      setFormData(prev => ({
        ...prev,
        ...mockExtractedData
      }));
      
    } catch (error) {
      console.error('Erro ao extrair dados do PDF:', error);
      alert('Erro ao processar o PDF. Tente novamente.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { success, data, error } = await makeAuthenticatedRequest('/orcamentos', {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (success) {
        alert('Orçamento salvo com sucesso!');
        setShowForm(false);
        setFormData({
          numeroOrcamento: '',
          cliente: '',
          email: '',
          telefone: '',
          endereco: '',
          data: new Date().toISOString().split('T')[0],
          validade: '',
          prazoEntrega: '',
          vendedor: '',
          observacoes: '',
          items: [
            {
              id: 1,
              descricao: '',
              quantidade: 1,
              valorUnitario: 0,
              valorTotal: 0
            }
          ],
          subtotal: 0,
          desconto: 0,
          valorTotal: 0,
          status: 'pendente',
          formaPagamento: '',
          condicoesPagamento: ''
        });
        setUploadedFile(null);
        setExtractedData(null);
      } else {
        alert(`Erro ao salvar orçamento: ${error}`);
      }
    } catch (error) {
      console.error('Erro ao salvar orçamento:', error);
      alert('Erro ao salvar orçamento. Tente novamente.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pendente: 'bg-yellow-100 text-yellow-800',
      aprovado: 'bg-green-100 text-green-800',
      rejeitado: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pendente;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pendente: <Clock className="w-4 h-4" />,
      aprovado: <CheckCircle className="w-4 h-4" />,
      rejeitado: <AlertCircle className="w-4 h-4" />
    };
    return icons[status] || icons.pendente;
  };

  const filteredOrcamentos = orcamentos.filter(orcamento => {
    const matchesSearch = orcamento.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         orcamento.numero.includes(searchTerm);
    const matchesStatus = statusFilter === 'todos' || orcamento.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orçamentos</h1>
            <p className="text-gray-600">Gerencie seus orçamentos e propostas</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Novo Orçamento</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('lista')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'lista'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Lista de Orçamentos
            </button>
          </nav>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por cliente ou número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="aprovado">Aprovado</option>
              <option value="rejeitado">Rejeitado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Orçamentos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orçamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrcamentos.map((orcamento) => (
                <tr key={orcamento.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">#{orcamento.numero}</div>
                        <div className="text-sm text-gray-500">{orcamento.items} items</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-2" />
                      <div className="text-sm font-medium text-gray-900">{orcamento.cliente}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 text-green-500 mr-1" />
                      <div className="text-sm font-medium text-gray-900">
                        R$ {orcamento.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">
                        {new Date(orcamento.data).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(orcamento.status)}`}>
                      {getStatusIcon(orcamento.status)}
                      <span className="ml-1 capitalize">{orcamento.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal do Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl max-h-[90vh] w-full overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Novo Orçamento</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Upload de PDF */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upload de PDF</h3>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {isExtracting ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                      <p className="text-gray-600">Extraindo dados do PDF...</p>
                    </div>
                  ) : uploadedFile ? (
                    <div className="flex flex-col items-center">
                      <FileText className="w-12 h-12 text-green-500 mb-4" />
                      <p className="text-gray-900 font-medium">{uploadedFile.name}</p>
                      <p className="text-green-600 text-sm mt-1">Dados extraídos com sucesso!</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Arraste um PDF aqui ou</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Selecionar arquivo
                      </button>
                      <p className="text-gray-500 text-sm mt-2">
                        O sistema irá extrair automaticamente as informações do orçamento
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Formulário Principal */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número do Orçamento *
                  </label>
                  <input
                    type="text"
                    name="numeroOrcamento"
                    value={formData.numeroOrcamento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente *
                  </label>
                  <input
                    type="text"
                    name="cliente"
                    value={formData.cliente}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
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
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço
                  </label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data do Orçamento
                  </label>
                  <input
                    type="date"
                    name="data"
                    value={formData.data}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Validade
                  </label>
                  <input
                    type="text"
                    name="validade"
                    value={formData.validade}
                    onChange={handleInputChange}
                    placeholder="Ex: 10 dias"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prazo de Entrega
                  </label>
                  <input
                    type="text"
                    name="prazoEntrega"
                    value={formData.prazoEntrega}
                    onChange={handleInputChange}
                    placeholder="Ex: 20 dias úteis"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendedor
                  </label>
                  <input
                    type="text"
                    name="vendedor"
                    value={formData.vendedor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Items do Orçamento */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Itens do Orçamento</h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Item</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.items.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descrição *
                          </label>
                          <input
                            type="text"
                            value={item.descricao}
                            onChange={(e) => handleItemChange(item.id, 'descricao', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantidade
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantidade}
                            onChange={(e) => handleItemChange(item.id, 'quantidade', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Valor Unitário
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.valorUnitario}
                            onChange={(e) => handleItemChange(item.id, 'valorUnitario', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Valor Total
                            </label>
                            <input
                              type="text"
                              value={`R$ ${item.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                              readOnly
                            />
                          </div>
                          
                          {formData.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-800 ml-2 mt-6"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Resumo Financeiro */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-end">
                    <div className="w-full max-w-sm space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Subtotal:</span>
                        <span className="text-sm font-medium">
                          R$ {formData.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-600">Desconto:</label>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">R$</span>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            name="desconto"
                            value={formData.desconto}
                            onChange={handleInputChange}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="border-t pt-2">
                        <div className="flex justify-between">
                          <span className="text-base font-medium text-gray-900">Total:</span>
                          <span className="text-base font-bold text-green-600">
                            R$ {formData.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forma de Pagamento
                  </label>
                  <select
                    name="formaPagamento"
                    value={formData.formaPagamento}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="cartao_credito">Cartão de Crédito</option>
                    <option value="cartao_debito">Cartão de Débito</option>
                    <option value="transferencia">Transferência</option>
                    <option value="boleto">Boleto</option>
                    <option value="pix">PIX</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condições de Pagamento
                  </label>
                  <input
                    type="text"
                    name="condicoesPagamento"
                    value={formData.condicoesPagamento}
                    onChange={handleInputChange}
                    placeholder="Ex: À vista, 30 dias, etc."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Observações */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Informações adicionais sobre o orçamento..."
                />
              </div>

              {/* Botões de Ação */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Orçamento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrcamentosPage;