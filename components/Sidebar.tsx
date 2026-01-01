import React from 'react';
import { Home, List, ChefHat, PlusSquare, Menu, X, Lock, Unlock, Info, Heart } from 'lucide-react';
import { ViewState } from '../types';
import AdPlaceholder from './AdPlaceholder';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isAdmin: boolean;
  isGuestMode: boolean;
  onAdminToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, isOpen, setIsOpen, isAdmin, isGuestMode, onAdminToggle }) => {
  
  const menuItems = [
    { id: ViewState.HOME, label: 'Início', icon: Home, color: 'text-blue-600' },
    { id: ViewState.CATEGORIES, label: 'Categorias', icon: List, color: 'text-green-600' },
    { id: ViewState.FAVORITES, label: 'Favoritos', icon: Heart, color: 'text-red-600' },
    { id: ViewState.AI_CHEF, label: 'Chef IA', icon: ChefHat, color: 'text-purple-600' },
    { id: ViewState.CREATE, label: 'Criar Receita', icon: PlusSquare, color: 'text-orange-600' },
    { id: ViewState.ABOUT, label: 'Sobre o Criador', icon: Info, color: 'text-teal-600' },
  ];

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white shadow-md z-40 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
            <button onClick={() => setIsOpen(true)} className="p-2 rounded-md hover:bg-gray-100 text-gray-700">
                <Menu size={24} />
            </button>
            <span className="font-bold text-xl text-gray-800">DelíciasMZ</span>
        </div>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      <div 
        className={`
          md:hidden fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ease-in-out
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Content */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-72 md:w-64 bg-white shadow-2xl md:shadow-none border-r border-gray-200
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 flex flex-col h-full
      `}>
        
        {/* Close Button (Mobile Only) */}
        <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors"
            aria-label="Fechar menu"
        >
            <X size={20} />
        </button>

        {/* Header Visual - Pattern em vez de Imagem */}
        <div className="h-40 w-full relative shrink-0 overflow-hidden bg-gradient-to-br from-green-600 via-red-600 to-yellow-500">
            {/* Overlay Patterns */}
            <div className="absolute inset-0 opacity-20" 
                style={{
                    backgroundImage: 'radial-gradient(circle at 20% 20%, white 2px, transparent 2px), radial-gradient(circle at 80% 80%, white 2px, transparent 2px)',
                    backgroundSize: '20px 20px'
                }}
            ></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>
            
            <div className="absolute inset-0 flex items-end p-6">
                <div>
                    <h2 className="text-white font-bold text-2xl drop-shadow-md tracking-wide">DelíciasMZ</h2>
                    <p className="text-white/80 text-xs font-medium">Sabores da Nossa Terra</p>
                </div>
            </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-4 flex flex-col">
            <ul className="space-y-2 px-3 mb-6">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                        <li key={item.id}>
                            <button
                                onClick={() => {
                                    setView(item.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200
                                    ${isActive 
                                        ? 'bg-orange-50 text-orange-700 shadow-sm ring-1 ring-orange-200' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                                `}
                            >
                                <div className={`p-2 rounded-lg mr-3 ${isActive ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'}`}>
                                    <Icon size={20} className={isActive ? 'text-orange-600' : 'text-gray-500'} />
                                </div>
                                <span className="font-medium">
                                    {item.label}
                                </span>
                            </button>
                        </li>
                    )
                })}
            </ul>

            {/* Ad Placeholder in Sidebar */}
            <div className="px-3 mt-auto mb-4">
                <AdPlaceholder format="rectangle" className="h-48 bg-gray-50" />
            </div>
        </nav>

        {/* Footer Info */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0">
            <p className="text-xs text-gray-400 text-center leading-relaxed mb-4">
                © 2026 DelíciasMZ<br/>
                <span className="opacity-75 font-semibold text-gray-500">Nelton da Méria Nazaré Ambate</span>
            </p>
            
            {!isGuestMode && (
                <button 
                    onClick={onAdminToggle}
                    className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-medium transition-colors
                        ${isAdmin 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                    `}
                >
                    {isAdmin ? <Unlock size={14} /> : <Lock size={14} />}
                    {isAdmin ? 'Sair do Admin' : 'Admin'}
                </button>
            )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;