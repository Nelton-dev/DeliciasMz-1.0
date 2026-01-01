import React, { useEffect } from 'react';
import { CheckCircle, X, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    // Fecha automaticamente após 4 segundos
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] animate-bounce-in">
      <div className={`
        flex items-center gap-3 min-w-[320px] max-w-sm p-4 rounded-xl shadow-2xl border-l-4 backdrop-blur-md
        ${type === 'success' ? 'bg-white/95 border-green-500' : 'bg-white/95 border-blue-500'}
      `}>
        <div className={`p-2 rounded-full ${type === 'success' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
          {type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
        </div>
        
        <div className="flex-1">
          <h4 className={`text-sm font-bold ${type === 'success' ? 'text-green-800' : 'text-blue-800'}`}>
            {type === 'success' ? 'Bem-vindo(a)!' : 'Olá!'}
          </h4>
          <p className="text-sm text-gray-600 font-medium leading-tight">
            {message}
          </p>
        </div>

        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded transition"
        >
          <X size={16} />
        </button>
      </div>

      {/* Adiciona animação inline para garantir que funcione sem config extra do Tailwind */}
      <style>{`
        @keyframes bounce-in {
          0% { transform: translate(-50%, -100%); opacity: 0; }
          60% { transform: translate(-50%, 10%); opacity: 1; }
          100% { transform: translate(-50%, 0); }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default Toast;