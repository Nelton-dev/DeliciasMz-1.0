import React from 'react';
import { Megaphone } from 'lucide-react';

interface AdPlaceholderProps {
  format?: 'horizontal' | 'vertical' | 'rectangle';
  className?: string;
  label?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ 
  format = 'horizontal', 
  className = '',
  label = 'Publicidade'
}) => {
  
  // Define tamanhos padrão baseados nos formatos comuns do Google Ads
  const getSizeClasses = () => {
    switch (format) {
      case 'vertical':
        return 'w-full h-64 md:h-full md:max-h-96 min-h-[250px]'; // Skyscraper
      case 'rectangle':
        return 'w-full h-64'; // MPU
      case 'horizontal':
      default:
        return 'w-full h-24'; // Leaderboard
    }
  };

  return (
    <div className={`
      bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg 
      flex flex-col items-center justify-center p-4 text-gray-400
      transition-opacity hover:opacity-75 cursor-default select-none
      ${getSizeClasses()}
      ${className}
    `}>
      <Megaphone size={20} className="mb-2 opacity-50" />
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
      <span className="text-[10px] mt-1 opacity-60">Espaço Reservado (Google AdMob/AdSense)</span>
    </div>
  );
};

export default AdPlaceholder;