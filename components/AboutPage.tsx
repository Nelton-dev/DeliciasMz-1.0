import React from 'react';
import { User, Code, Heart, Mail, MessageCircle, Wallet } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12 pb-24">
      {/* Cabeçalho do Perfil */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-md border-2 border-white/30">
                <User size={64} className="text-white" />
            </div>
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-1">Nelton da Méria Nazaré Ambate</h1>
                <p className="text-orange-100 font-medium mb-3">Junior Developer Mobile & Web</p>
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-sm">
                    <Code size={16} />
                    <span>17 Anos</span>
                </div>
            </div>
        </div>
        
        {/* Decoração de fundo */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {/* Seção Sobre o Projeto */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="text-red-500" />
            Objetivo do Aplicativo
        </h2>
        <p className="text-gray-600 leading-relaxed">
            O <strong>DelíciasMZ</strong> nasceu do desejo de digitalizar e preservar a rica cultura gastronômica de Moçambique. 
            A nossa missão é criar uma comunidade onde moçambicanos e amantes da nossa culinária possam compartilhar receitas 
            tradicionais, descobrir novos sabores e manter viva a nossa história através da comida.
        </p>
      </div>

      {/* Seção de Apoio / Doação */}
      <div className="bg-orange-50 rounded-xl border border-orange-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Wallet className="text-orange-600" />
            Apoie o Projeto
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
            Sou um jovem desenvolvedor apaixonado por tecnologia. Se você deseja ver este projeto crescer com mais recursos 
            (como vídeos, chat em tempo real e loja de ingredientes), considere fazer uma doação ou entrar em contato.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
            <a 
                href="mailto:neltonambate7@gmail.com"
                className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition group"
            >
                <div className="bg-blue-100 p-2 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                    <Mail size={20} />
                </div>
                <div>
                    <span className="block text-xs text-gray-500 font-bold uppercase">Email</span>
                    <span className="text-sm font-medium text-gray-800">neltonambate7@gmail.com</span>
                </div>
            </a>

            <a 
                href="https://wa.me/258875244921"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 bg-white p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition group"
            >
                <div className="bg-green-100 p-2 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition">
                    <MessageCircle size={20} />
                </div>
                <div>
                    <span className="block text-xs text-gray-500 font-bold uppercase">WhatsApp / M-Pesa</span>
                    <span className="text-sm font-medium text-gray-800">(+258) 87 524 4921</span>
                </div>
            </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;