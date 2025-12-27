import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, Minimize2, AlertCircle, Upload } from 'lucide-react';

// Lista de reprodução filtrada: Apenas as faixas que funcionavam anteriormente.
// Removidos: "Moz Drums", "Lounge Music" e as novas faixas instáveis.
const DEFAULT_PLAYLIST = [
  {
    title: "Vibrações Africanas",
    artist: "Ritmo Tradicional",
    src: "https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3"
  },
  {
    title: "Amanhecer no Índico",
    artist: "Sons da Natureza",
    src: "https://cdn.pixabay.com/audio/2022/08/02/audio_884fe92c21.mp3"
  },
  {
    title: "Noite Estrelada",
    artist: "Ambiente Calmo",
    src: "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"
  }
];

interface MusicPlayerProps {
  isLandingPage?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ isLandingPage = false }) => {
  const [playlist, setPlaylist] = useState(DEFAULT_PLAYLIST);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [error, setError] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const currentTrack = playlist[currentTrackIndex];

  // Helper to safely play audio handling race conditions
  const playAudioSafe = () => {
    if (!audioRef.current) return;
    
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.catch((error: unknown) => {
        const e = error as Error;
        if (e.name === 'AbortError' || e.name === 'NotAllowedError') {
          return;
        }
        console.error("Audio Play Error:", e);
      });
    }
  };

  useEffect(() => {
    if (!audioRef.current) return;
    setError(false);
    audioRef.current.load();

    if (isPlaying) {
      playAudioSafe();
    } else {
      audioRef.current.pause();
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    if (!isPlaying) setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    if (!isPlaying) setIsPlaying(true);
  };

  const handleTrackError = (e: any) => {
    if (!currentTrack.src) return;
    const errorMsg = e.target?.error?.message || "Unknown error";
    console.warn(`Erro ao carregar faixa: ${currentTrack.title} (${errorMsg}). Pulando...`);
    setError(true);
    // Tenta pular para a próxima música automaticamente após breve delay
    setTimeout(() => {
        nextTrack();
    }, 1500);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newTracks = Array.from(files).map((file: File) => ({
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Seu Dispositivo",
        src: URL.createObjectURL(file),
        isLocal: true
      }));

      const newPlaylist = [...playlist, ...newTracks];
      setPlaylist(newPlaylist);
      // Toca a música adicionada imediatamente
      setCurrentTrackIndex(newPlaylist.length - newTracks.length); 
      setIsPlaying(true);
    }
  };

  // Se estiver na Landing Page, renderiza apenas um botão simples no topo
  if (isLandingPage) {
    return (
      <div className="absolute top-6 right-6 z-50">
        <audio 
          ref={audioRef} 
          src={currentTrack.src} 
          onEnded={nextTrack}
          onError={handleTrackError}
          crossOrigin="anonymous"
        />
        <button
          onClick={togglePlay}
          className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all shadow-lg border border-white/20
            ${isPlaying 
              ? 'bg-orange-500/90 text-white hover:bg-orange-600' 
              : 'bg-white/20 text-white hover:bg-white/30'}`}
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
          <span className="text-sm font-medium hidden sm:inline">
            {isPlaying ? 'Tocando' : 'Música'}
          </span>
        </button>
      </div>
    );
  }

  // Se estiver no App normal, renderiza o widget completo no rodapé
  return (
    <div 
      className={`fixed z-50 transition-all duration-300 ease-in-out shadow-2xl border border-orange-100
        ${isMinimized 
          ? 'bottom-4 right-4 w-14 h-14 rounded-full bg-orange-600 hover:scale-110 cursor-pointer' 
          : 'bottom-4 right-4 md:bottom-8 md:right-8 w-72 bg-white rounded-2xl'
        }`}
    >
      <audio 
        ref={audioRef} 
        src={currentTrack.src} 
        onEnded={nextTrack}
        onError={handleTrackError}
        crossOrigin="anonymous"
      />
      
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
        accept="audio/*"
        multiple
      />

      {isMinimized ? (
        <div 
          onClick={() => setIsMinimized(false)}
          className="w-full h-full flex items-center justify-center text-white relative"
        >
           {error ? <AlertCircle size={24} className="text-red-200" /> : <Music size={24} className={isPlaying ? 'animate-pulse' : ''} />}
           {isPlaying && !error && (
             <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-400 border-2 border-orange-600"></span>
           )}
        </div>
      ) : (
        <div className="p-4">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className="bg-orange-100 p-1.5 rounded-lg">
                        <Volume2 size={16} className="text-orange-600" />
                    </div>
                    <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">Rádio Cozinha</span>
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-gray-400 hover:text-orange-600 transition p-1 hover:bg-orange-50 rounded"
                        title="Adicionar música do dispositivo"
                    >
                        <Upload size={16} />
                    </button>
                    <button onClick={() => setIsMinimized(true)} className="text-gray-400 hover:text-gray-600">
                        <Minimize2 size={16} />
                    </button>
                </div>
            </div>

            <div className="mb-4">
                <h4 className="font-bold text-gray-800 text-sm truncate">
                    {error ? <span className="text-red-500">Erro. Pulando...</span> : currentTrack.title}
                </h4>
                <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                    {currentTrack.artist}
                    {(currentTrack as any).isLocal && <span className="text-[9px] bg-green-100 text-green-700 px-1 rounded">LOCAL</span>}
                </p>
            </div>

            <div className="flex items-center justify-between">
                <button onClick={prevTrack} className="text-gray-400 hover:text-orange-600 transition">
                    <SkipBack size={20} />
                </button>
                
                <button 
                    onClick={togglePlay}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition
                        ${error ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}
                    disabled={error}
                >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </button>
                
                <button onClick={nextTrack} className="text-gray-400 hover:text-orange-600 transition">
                    <SkipForward size={20} />
                </button>
            </div>
            
            <div className="mt-4 flex gap-1 h-1">
                <div className={`h-full rounded-full bg-orange-500 ${isPlaying && !error ? 'animate-pulse w-full' : 'w-1/3'}`}></div>
                <div className="h-full w-full bg-gray-100 rounded-full"></div>
            </div>
            
            <div className="mt-2 text-[10px] text-center text-gray-400">
                {currentTrackIndex + 1} / {playlist.length}
            </div>
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;