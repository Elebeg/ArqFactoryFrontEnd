import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Heart,
  ExternalLink,
  Shield,
  Zap,
  Users,
  Award,
  Globe,
  Calendar,
  ArrowUp
} from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigation = (path) => {
    navigate(path);
    scrollToTop();
  };

  const quickLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Projetos', path: '/projetos' },
    { name: 'Clientes', path: '/clientes' },
    { name: 'Orçamentos', path: '/orcamentos' },
    { name: 'Relatórios', path: '/relatorios' },
    { name: 'Portfólio', path: '/portfolio' }
  ];

  const footerLinks = [
    { name: 'Política de Privacidade', path: '/politica-privacidade' },
    { name: 'Termos de Uso', path: '/termos-uso' },
    { name: 'Suporte', path: '/suporte' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/5 rounded-full -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/3 rounded-full translate-x-48 translate-y-48"></div>
      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-600/5 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">ArqFactory</h3>
                  <p className="text-blue-200 text-sm">Gestão Arquitetônica Inteligente</p>
                </div>
              </div>
              
              <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
                Transformamos a gestão de projetos arquitetônicos com tecnologia avançada, 
                conectando arquitetos, clientes e equipes em uma plataforma integrada e eficiente.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div className="text-2xl font-bold text-blue-400">10K+</div>
                  <div className="text-xs text-gray-400">Projetos</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div className="text-2xl font-bold text-emerald-400">500+</div>
                  <div className="text-xs text-gray-400">Arquitetos</div>
                </div>
                <div className="text-center p-3 bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div className="text-2xl font-bold text-purple-400">98%</div>
                  <div className="text-xs text-gray-400">Satisfação</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-300 hover:text-blue-300 transition-colors cursor-pointer">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>contato@arqfactory.com.br</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-300 hover:text-blue-300 transition-colors cursor-pointer">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>+55 (11) 9999-9999</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>São Paulo, SP - Brasil</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-6 text-white">Links Rápidos</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <button 
                      onClick={() => handleNavigation(link.path)}
                      className="text-gray-300 hover:text-blue-400 transition-colors text-sm flex items-center group"
                    >
                      <span>{link.name}</span>
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold text-lg mb-6 text-white">Recursos</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 group cursor-pointer">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-blue-500/30 transition-colors">
                    <Shield className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">Segurança</h5>
                    <p className="text-xs text-gray-400">Dados protegidos e criptografados</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 group cursor-pointer">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-emerald-500/30 transition-colors">
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">Performance</h5>
                    <p className="text-xs text-gray-400">Sistema rápido e responsivo</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 group cursor-pointer">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-purple-500/30 transition-colors">
                    <Users className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">Colaboração</h5>
                    <p className="text-xs text-gray-400">Trabalho em equipe integrado</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 group cursor-pointer">
                  <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mt-0.5 group-hover:bg-orange-500/30 transition-colors">
                    <Award className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <h5 className="text-sm font-medium text-white group-hover:text-orange-300 transition-colors">Qualidade</h5>
                    <p className="text-xs text-gray-400">Padrões profissionais elevados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="mt-12 pt-8 border-t border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-xl font-bold mb-2">Fique por dentro das novidades</h4>
                <p className="text-gray-300 text-sm">
                  Receba atualizações sobre novas funcionalidades, dicas e tendências da arquitetura
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:bg-white/15 transition-all"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg font-medium hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900">
                  Inscrever-se
                </button>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex space-x-6 mb-4 sm:mb-0">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors group">
                  <Globe className="w-5 h-5 text-gray-300 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors group">
                  <Mail className="w-5 h-5 text-gray-300 group-hover:text-white" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors group">
                  <Phone className="w-5 h-5 text-gray-300 group-hover:text-white" />
                </a>
              </div>
              
              <button
                onClick={scrollToTop}
                className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors group"
                aria-label="Voltar ao topo"
              >
                <ArrowUp className="w-5 h-5 text-blue-400 group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 bg-gray-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
              <div className="flex items-center space-x-1 mb-2 sm:mb-0">
                <span>© {currentYear} ArqFactory. Todos os direitos reservados.</span>
                <Heart className="w-4 h-4 text-red-400 mx-2" />
                <span>Feito com paixão pela arquitetura</span>
              </div>
              
              <div className="flex space-x-6">
                {footerLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavigation(link.path)}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-800 text-center">
              <p className="text-xs text-gray-500">
                CNPJ: 00.000.000/0001-00 | Desenvolvido por arquitetos, para arquitetos
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;