import React, { useEffect, useRef } from 'react';
import { Megaphone, ExternalLink } from 'lucide-react';

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
  const adContainerRef = useRef<HTMLDivElement>(null);

  // --- ÁREA DE CONFIGURAÇÃO DO ADSTERRA ---
  // Quando você tiver sua conta Adsterra e seus códigos (Zone IDs),
  // você pode descomentar e adaptar este useEffect:
  /*
  useEffect(() => {
    if (!adContainerRef.current) return;

    // Exemplo de integração de Banner Nativo ou Iframe do Adsterra
    // Limpa o container antes de inserir
    // adContainerRef.current.innerHTML = '';

    // Cria o script
    // const script = document.createElement('script');
    // script.type = 'text/javascript';
    // script.src = '//pl12345678.highcpmgate.com/ab/cd/ef/abcdef123456.js'; // URL fornecida pelo Adsterra
    
    // Configurações (se necessário, dependendo do tipo de anúncio)
    // const conf = document.createElement('script');
    // conf.innerHTML = `atOptions = { 'key': 'YOUR_KEY', 'format': 'iframe', 'height': 90, 'width': 728, 'params': {} };`;
    
    // adContainerRef.current.appendChild(conf);
    // adContainerRef.current.appendChild(script);

  }, []);
  */

  // Define tamanhos padrão para manter o layout estável enquanto o anúncio carrega
  const getSizeClasses = () => {
    switch (format) {
      case 'vertical':
        return 'w-full h-64 md:h-full md:max-h-96 min-h-[250px]'; // Skyscraper (160x600 aprox)
      case 'rectangle':
        return 'w-full h-[250px]'; // MPU (300x250)
      case 'horizontal':
      default:
        return 'w-full h-[90px]'; // Leaderboard (728x90)
    }
  };

  return (
    <div 
      ref={adContainerRef}
      className={`
        bg-white border border-gray-200 rounded-lg shadow-sm
        flex flex-col items-center justify-center p-4 text-gray-400 overflow-hidden relative
        ${getSizeClasses()}
        ${className}
      `}
    >
      {/* Visual do Placeholder (aparece enquanto não há script real) */}
      <div className="flex flex-col items-center animate-pulse">
        <div className="flex items-center gap-2 mb-1">
            <Megaphone size={16} className="text-red-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-600">{label}</span>
        </div>
        <div className="flex items-center gap-1 opacity-60">
            <span className="text-[10px] font-medium">Ads by Adsterra</span>
            <ExternalLink size={10} />
        </div>
      </div>

      {/* Marca d'água de fundo */}
      <div className="absolute inset-0 bg-gray-50 opacity-50 z-[-1]" 
           style={{backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '10px 10px'}}>
      </div>
    </div>
  );
};

export default AdPlaceholder;