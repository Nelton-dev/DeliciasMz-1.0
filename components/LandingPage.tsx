import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChefHat, ArrowRight, Flame, Leaf, Utensils, Star } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

const BACKGROUND_IMAGES = [
  // Matapa / Verduras
  "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?q=80&w=1200&auto=format&fit=crop",
  // Frango Grelhado
  "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=1200&auto=format&fit=crop",
  // Camarão / Marisco
   "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop",
  // Especiarias
  "https://images.unsplash.com/photo-1532336414038-517a237609ea?q=80&w=1200&auto=format&fit=crop"
];

const TAGLINES = [
  "A alma de Moçambique no prato",
  "De Maputo a Pemba, o melhor sabor",
  "Descubra. Cozinhe. Partilhe.",
  "O segredo da Matapa perfeita"
];

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Avança para a próxima imagem e limpa estados de erro
  const nextImage = useCallback(() => {
    setImageError(false); 
    setCurrentImageIndex((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
  }, []);

  // Lógica de Erro: Se a imagem falhar, ativa o erro (mostra gradiente), espera 2s e tenta a próxima
  const handleImageError = () => {
    console.warn("Imagem falhou, ativando backup...");
    setImageError(true);
    
    // Limpa o timer automático atual para não conflitar
    if (timerRef.current) clearInterval(timerRef.current);

    // Aguarda 2 segundos exibindo o gradiente antes de mudar
    setTimeout(() => {
      nextImage();
    }, 2000);
  };

  // Ciclo Automático de Imagens (5 segundos)
  useEffect(() => {
    // Se estiver em estado de erro, pausamos o ciclo normal (o handleImageError gerencia a transição)
    if (imageError) return;

    timerRef.current = setInterval(nextImage, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [imageError, nextImage]);

  // Ciclo de Texto (Taglines)
  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 3500);
    return () => clearInterval(textInterval);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden font-sans bg-gray-900">
      
      {/* --- BACKGROUND LAYER --- */}
      
      {/* 1. Gradiente de Fundo (Backup/Fallback) - Sempre presente atrás */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-black z-0" />

      {/* 2. Imagens Rotativas */}
      {BACKGROUND_IMAGES.map((img, index) => (
        <div 
          key={img}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out z-0 
            ${index === currentImageIndex && !imageError ? 'opacity-100' : 'opacity-0'}
          `}
        >
          {/* Renderização condicional para performance: Apenas a atual e a próxima */}
          {(index === currentImageIndex || index === (currentImageIndex + 1) % BACKGROUND_IMAGES.length) && (
             <img 
               src={img} 
               alt="Background" 
               className="w-full h-full object-cover animate-slow-zoom"
               onError={handleImageError}
             />
          )}
          {/* Dark Overlay sobre a imagem para garantir leitura do texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
        </div>
      ))}

      {/* --- CSS ANIMATIONS --- */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
          20% { opacity: 0.4; }
          80% { opacity: 0.2; }
          100% { transform: translateY(-20vh) scale(1.2); opacity: 0; }
        }
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: floatUp 15s linear infinite; }
        .animate-slow-zoom { animation: slowZoom 20s infinite alternate linear; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-shine { animation: shine 1.5s infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        
        .delay-1 { animation-delay: 0s; }
        .delay-2 { animation-delay: 4s; }
        .delay-3 { animation-delay: 8s; }
        .delay-4 { animation-delay: 12s; }
      `}</style>

      {/* Floating Icons Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute left-[10%] bottom-0 text-orange-500/30 animate-float delay-1"><Leaf size={40} /></div>
        <div className="absolute left-[30%] bottom-0 text-yellow-500/20 animate-float delay-2"><Flame size={60} /></div>
        <div className="absolute left-[70%] bottom-0 text-red-500/20 animate-float delay-3"><Utensils size={50} /></div>
        <div className="absolute left-[90%] bottom-0 text-orange-400/30 animate-float delay-4"><ChefHat size={45} /></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-6 text-center">
        
        {/* Animated Logo Container */}
        <div className="mb-8 relative group">
          <div className="absolute inset-0 bg-orange-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse"></div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-full border border-white/20 shadow-2xl relative transform transition-transform group-hover:scale-105 duration-300">
            <ChefHat size={64} className="text-white drop-shadow-lg" />
          </div>
          {/* Decorative Star */}
          <div className="absolute -top-2 -right-2 text-yellow-400 animate-spin-slow">
            <Star size={24} fill="currentColor" />
          </div>
        </div>
        
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-2xl">
          Delícias<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">MZ</span>
        </h1>
        
        {/* Dynamic Subtitle */}
        <div className="h-12 mb-10 flex items-center justify-center">
          {/* Usamos key para forçar a recriação do elemento e reiniciar a animação */}
          <p key={currentTaglineIndex} className="text-xl md:text-2xl text-gray-200 font-light tracking-wide animate-fade-in-up">
            {TAGLINES[currentTaglineIndex]}
          </p>
        </div>
        
        {/* CTA Button */}
        <button 
          onClick={onStart}
          className="group relative px-8 py-5 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300 overflow-hidden"
        >
          {/* Shine Effect */}
          <div className="absolute top-0 -inset-full h-full w-1/2 z-10 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
          
          <div className="flex items-center gap-3 relative z-20">
            <span>Entrar na Cozinha</span>
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Feature Pills */}
        <div className="mt-16 flex flex-wrap justify-center gap-4">
           {[
             { icon: "🌿", text: "Receitas Autênticas" },
             { icon: "👨‍🍳", text: "Chef IA" },
             { icon: "🇲🇿", text: "100% Moçambicano" }
           ].map((feature, i) => (
             <div 
                key={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-white/80 text-sm flex items-center gap-2 hover:bg-white/10 transition-colors cursor-default"
             >
               <span>{feature.icon}</span>
               <span>{feature.text}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Footer / Credits */}
      <div className="absolute bottom-6 w-full text-center z-20 px-4">
        <p className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-medium">
          Nelton da Méria Nazaré Ambate &copy; 2025
        </p>
      </div>
    </div>
  );
};

export default LandingPage;