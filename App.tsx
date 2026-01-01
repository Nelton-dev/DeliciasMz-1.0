import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import RecipeCard from './components/RecipeCard';
import AddRecipe from './components/AddRecipe';
import AIChef from './components/AIChef';
import MusicPlayer from './components/MusicPlayer';
import AboutPage from './components/AboutPage';
import AdPlaceholder from './components/AdPlaceholder';
import Login from './components/Login';
import Toast from './components/Toast'; // Importa o novo componente
import { ViewState, Recipe, CATEGORIES } from './types';
import { storageService } from './services/storage';
import { supabase } from './services/supabase';
import { Utensils, Plus, Heart, LogOut, User } from 'lucide-react';

const App: React.FC = () => {
  // Auth State
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isGuestMode, setIsGuestMode] = useState(false);

  // App State
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  
  // Feedback State
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);

  // 1. Check Auth on Mount
  useEffect(() => {
    let mounted = true;

    // Timeout de segurança: se o Supabase não responder em 3s, libera o carregamento
    const timer = setTimeout(() => {
        if (mounted && authLoading) setAuthLoading(false);
    }, 3000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
          setSession(session);
          setAuthLoading(false);
      }
    }).catch(err => {
        // Silently warn for offline/network errors instead of red console error
        console.warn("Supabase Auth (Modo Offline):", err.message);
        if (mounted) setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
          setSession(session);
          if(session) {
              fetchRecipes();
              // Lógica de Boas-vindas para Login Real
              if (event === 'SIGNED_IN') {
                  const name = session.user.user_metadata?.full_name?.split(' ')[0] || 'Chef';
                  setWelcomeMessage(`Que bom ter você aqui, ${name}!`);
              }
          }
      }
    });

    return () => {
        mounted = false;
        clearTimeout(timer);
        subscription.unsubscribe();
    };
  }, []);

  // 2. Fetch Data
  const fetchRecipes = async () => {
      setDataLoading(true);
      const data = await storageService.getRecipes();
      setRecipes(data);
      setFavorites(storageService.getFavorites());
      setDataLoading(false);
  };

  // Carrega receitas iniciais se entrar em modo visitante ou landing
  useEffect(() => {
      if (isGuestMode || !session) {
          fetchRecipes(); 
      }
  }, [session, isGuestMode]);

  const handleLogout = async () => {
      if (session) {
        await supabase.auth.signOut();
      }
      setSession(null);
      setIsGuestMode(false);
      setCurrentView(ViewState.LANDING);
      setWelcomeMessage(null); // Limpa mensagem ao sair
  };

  const handleAdminToggle = () => {
    if (isGuestMode) return; // Visitantes não acessam admin
    
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      const pwd = window.prompt("Senha de Administrador:");
      if (pwd === "admin") {
        setIsAdmin(true);
        alert("Modo Admin Ativado!");
      }
    }
  };

  const handleGuestLogin = () => {
      setIsGuestMode(true);
      setWelcomeMessage("Você entrou como visitante. Explore à vontade!");
  };

  // --- Async Wrappers for Actions ---

  const currentUserId = session?.user?.id || (isGuestMode ? 'guest' : '');

  const handleToggleFavorite = (id: string) => {
    const newFavorites = storageService.toggleFavorite(id);
    setFavorites(newFavorites);
  };

  const handleToggleLike = async (id: string) => {
    if (!session && !isGuestMode) return;
    if (isGuestMode) return alert("Modo Visitante: Faça login para curtir receitas!");
    
    // Otimistic UI update
    const recipe = recipes.find(r => r.id === id);
    if(recipe) await storageService.toggleLike(id, currentUserId, recipe.likedBy);
    fetchRecipes(); // Re-sync
  };

  const handleAddComment = async (id: string, text: string) => {
    if (isGuestMode) return alert("Modo Visitante: Faça login para comentar!");
    if (!session) return;
    await storageService.addComment(id, text, currentUserId);
    fetchRecipes();
  };

  const handleAddReply = async (recipeId: string, commentId: string, text: string) => {
    if (isGuestMode) return alert("Modo Visitante: Faça login para responder!");
    if (!session) return;
    await storageService.addReply(recipeId, commentId, text, currentUserId);
    fetchRecipes();
  };

  const handleSaveRecipe = async (savedRecipe: Recipe) => {
    if (isGuestMode) return alert("Modo Visitante: Faça login para publicar receitas!");
    if (!session) return;
    
    setDataLoading(true);
    try {
        await storageService.saveRecipe(savedRecipe, currentUserId);
        await fetchRecipes();
        setEditingRecipe(null);
        setCurrentView(ViewState.HOME);
    } catch (error: any) {
        alert("Erro ao salvar: " + error.message);
    } finally {
        setDataLoading(false);
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    if (isGuestMode) return;
    if (!session) return;
    if (window.confirm("Tem certeza que deseja apagar esta receita permanentemente?")) {
      await storageService.deleteRecipe(id);
      fetchRecipes();
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    // Apenas o autor ou admin pode editar
    if (isGuestMode) return alert("Modo Visitante: Ação não permitida.");
    
    if (isAdmin || recipe.author.id === session?.user?.id) {
        setEditingRecipe(recipe);
        setCurrentView(ViewState.CREATE);
    } else {
        alert("Você só pode editar suas próprias receitas.");
    }
  };

  // Helper to change view
  const handleSetView = (view: ViewState) => {
    // LIMITAÇÃO MODO VISITANTE: Impede entrar na tela de criação
    if (view === ViewState.CREATE && isGuestMode) {
        alert("🔒 Modo Visitante\n\nPara compartilhar suas próprias receitas, por favor faça login ou crie uma conta.");
        return;
    }

    if (view === ViewState.CREATE && currentView !== ViewState.CREATE) {
        setEditingRecipe(null);
    }
    setCurrentView(view);
    setSelectedCategory(null);
  };

  const filteredRecipes = selectedCategory 
    ? recipes.filter(r => r.category === selectedCategory)
    : recipes;

  const favoriteRecipes = recipes.filter(r => favorites.includes(r.id));

  // --- Render Logic ---

  if (authLoading) {
      return <div className="h-screen w-screen flex items-center justify-center bg-gray-50 text-orange-600 font-bold">Carregando DelíciasMZ...</div>;
  }

  // Se não tem sessão, não está em modo visitante e não está na Landing Page, mostra Login
  if (!session && !isGuestMode && currentView !== ViewState.LANDING) {
      return <Login onGuestLogin={handleGuestLogin} />;
  }

  const EmptyState = ({ message, icon: Icon = Utensils, actionLabel, onAction }: any) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-orange-100 p-6 rounded-full mb-4">
            <Icon size={48} className="text-orange-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{message}</h3>
        <p className="text-gray-500 max-w-sm mb-6">A cozinha está vazia. Que tal ser o primeiro a compartilhar uma delícia moçambicana?</p>
        {actionLabel && onAction && (
          <button onClick={onAction} className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md">
              <Plus size={20} />
              {actionLabel}
          </button>
        )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      <MusicPlayer isLandingPage={currentView === ViewState.LANDING} />
      
      {/* Exibe o Toast se houver mensagem */}
      {welcomeMessage && (
          <Toast 
            message={welcomeMessage} 
            type={isGuestMode ? 'info' : 'success'}
            onClose={() => setWelcomeMessage(null)} 
          />
      )}

      {currentView === ViewState.LANDING ? (
         <div className="w-full h-full z-40">
            <LandingPage onStart={() => setCurrentView(ViewState.HOME)} />
         </div>
      ) : (
        <>
          <Sidebar 
            currentView={currentView} 
            setView={handleSetView}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            isAdmin={isAdmin}
            isGuestMode={isGuestMode}
            onAdminToggle={handleAdminToggle}
          />

          <main className="flex-1 h-full overflow-y-auto pt-16 md:pt-0 scroll-smooth">
            <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 pb-24">
                
                {/* Header Profile / Logout */}
                <div className="flex justify-end mb-4">
                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
                        {isGuestMode ? (
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                                <User size={14} className="text-gray-500"/>
                            </div>
                        ) : (
                            <img src={session?.user?.user_metadata?.avatar_url || 'https://via.placeholder.com/30'} className="w-6 h-6 rounded-full" />
                        )}
                        
                        <span className="text-xs font-medium text-gray-700 max-w-[100px] truncate">
                            {isGuestMode ? 'Visitante' : session?.user?.user_metadata?.full_name}
                        </span>
                        
                        <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 ml-1" title={isGuestMode ? "Sair do Modo Visitante" : "Sair"}>
                            <LogOut size={14} />
                        </button>
                    </div>
                </div>

                {currentView === ViewState.HOME && (
                    <>
                        <header className="mb-8 flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Feed de Receitas</h1>
                                <p className="text-gray-500">O sabor autêntico de Moçambique na sua tela.</p>
                            </div>
                        </header>
                        
                        <div className="mb-8">
                            <AdPlaceholder format="horizontal" />
                        </div>

                        <div className="space-y-6">
                            {dataLoading ? (
                                <div className="text-center py-10 text-gray-400">Carregando receitas...</div>
                            ) : recipes.length === 0 ? (
                                <EmptyState message="Nenhuma receita encontrada" actionLabel="Criar Receita Agora" onAction={() => handleSetView(ViewState.CREATE)} />
                            ) : (
                                recipes.map(recipe => (
                                    <RecipeCard 
                                        key={recipe.id} 
                                        recipe={recipe} 
                                        isFavorite={favorites.includes(recipe.id)}
                                        onToggleFavorite={handleToggleFavorite}
                                        onToggleLike={handleToggleLike}
                                        onAddComment={handleAddComment}
                                        onAddReply={handleAddReply}
                                        currentUserId={currentUserId}
                                        isAdmin={isAdmin}
                                        onDelete={handleDeleteRecipe}
                                        onEdit={handleEditRecipe}
                                    />
                                ))
                            )}
                        </div>
                    </>
                )}

                {currentView === ViewState.FAVORITES && (
                    <div>
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Meus Favoritos</h1>
                        </header>
                        <div className="space-y-6">
                            {favoriteRecipes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="bg-red-50 p-6 rounded-full mb-4">
                                        <Heart size={48} className="text-red-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Ainda não tem favoritos</h3>
                                    <button onClick={() => handleSetView(ViewState.HOME)} className="text-orange-600 font-semibold hover:underline">Ir para o Feed</button>
                                </div>
                            ) : (
                                favoriteRecipes.map(recipe => (
                                    <RecipeCard 
                                        key={recipe.id} 
                                        recipe={recipe} 
                                        isFavorite={true}
                                        onToggleFavorite={handleToggleFavorite}
                                        onToggleLike={handleToggleLike}
                                        onAddComment={handleAddComment}
                                        onAddReply={handleAddReply}
                                        currentUserId={currentUserId}
                                        isAdmin={isAdmin}
                                        onDelete={handleDeleteRecipe}
                                        onEdit={handleEditRecipe}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}

                {currentView === ViewState.CATEGORIES && (
                    <div>
                        <header className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Categorias</h1>
                        </header>
                        {!selectedCategory ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {CATEGORIES.map(cat => (
                                    <button 
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-orange-300 transition text-left"
                                    >
                                        <h3 className="text-xl font-semibold text-gray-800">{cat}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{recipes.filter(r => r.category === cat).length} receitas</p>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <button onClick={() => setSelectedCategory(null)} className="mb-4 text-orange-600 font-medium hover:underline">← Voltar</button>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">{selectedCategory}</h2>
                                <div className="space-y-6">
                                    {filteredRecipes.length > 0 ? filteredRecipes.map(recipe => (
                                        <RecipeCard 
                                            key={recipe.id} 
                                            recipe={recipe} 
                                            isFavorite={favorites.includes(recipe.id)}
                                            onToggleFavorite={handleToggleFavorite}
                                            onToggleLike={handleToggleLike}
                                            onAddComment={handleAddComment}
                                            onAddReply={handleAddReply}
                                            currentUserId={currentUserId}
                                            isAdmin={isAdmin}
                                            onDelete={handleDeleteRecipe}
                                            onEdit={handleEditRecipe}
                                        />
                                    )) : <EmptyState message={`Sem receitas de ${selectedCategory}`} actionLabel="Criar Receita" onAction={() => handleSetView(ViewState.CREATE)}/>}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {currentView === ViewState.CREATE && (
                    <AddRecipe 
                        initialRecipe={editingRecipe}
                        onSave={handleSaveRecipe} 
                        onCancel={() => {
                            setEditingRecipe(null);
                            setCurrentView(ViewState.HOME);
                        }} 
                    />
                )}

                {currentView === ViewState.AI_CHEF && <AIChef />}
                {currentView === ViewState.ABOUT && <AboutPage />}

            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default App;