import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Sidebar from './components/Sidebar';
import RecipeCard from './components/RecipeCard';
import AddRecipe from './components/AddRecipe';
import AIChef from './components/AIChef';
import MusicPlayer from './components/MusicPlayer';
import AboutPage from './components/AboutPage';
import AdPlaceholder from './components/AdPlaceholder';
import { ViewState, Recipe, CATEGORIES } from './types';
import { storageService } from './services/storage';
import { Utensils, Plus, Heart } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.LANDING);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Mock User Identity (In a real app, this would come from Auth)
  const [currentUser] = useState({ id: 'me_' + Date.now(), name: 'Você' });

  // Admin & Editing State
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  // Load data on mount
  useEffect(() => {
    const loadedRecipes = storageService.getRecipes();
    const loadedFavorites = storageService.getFavorites();
    setRecipes(loadedRecipes);
    setFavorites(loadedFavorites);
  }, []);

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      const pwd = window.prompt("Senha de Administrador:");
      if (pwd === "admin") {
        setIsAdmin(true);
        alert("Modo Admin Ativado! Agora você pode editar ou excluir receitas.");
      } else if (pwd !== null) {
        alert("Senha incorreta.");
      }
    }
  };

  const handleToggleFavorite = (id: string) => {
    const newFavorites = storageService.toggleFavorite(id);
    setFavorites(newFavorites);
  };

  const handleToggleLike = (id: string) => {
    const updatedRecipes = storageService.toggleLike(id, currentUser.id);
    setRecipes(updatedRecipes);
  };

  const handleAddComment = (id: string, text: string) => {
    const updatedRecipes = storageService.addComment(id, text, currentUser);
    setRecipes(updatedRecipes);
  };

  const handleAddReply = (recipeId: string, commentId: string, text: string) => {
    const updatedRecipes = storageService.addReply(recipeId, commentId, text, currentUser);
    setRecipes(updatedRecipes);
  };

  const handleSaveRecipe = (savedRecipe: Recipe) => {
    const updatedList = storageService.saveRecipe(savedRecipe);
    setRecipes(updatedList);
    setEditingRecipe(null);
    setCurrentView(ViewState.HOME);
  };

  const handleDeleteRecipe = (id: string) => {
    if (window.confirm("Tem certeza que deseja apagar esta receita permanentemente?")) {
      const updatedList = storageService.deleteRecipe(id);
      setRecipes(updatedList);
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setCurrentView(ViewState.CREATE);
  };

  // Helper to change view and reset editing state if needed
  const handleSetView = (view: ViewState) => {
    if (view === ViewState.CREATE && currentView !== ViewState.CREATE) {
        setEditingRecipe(null); // Reset if manually going to create
    }
    setCurrentView(view);
    setSelectedCategory(null);
  };

  const filteredRecipes = selectedCategory 
    ? recipes.filter(r => r.category === selectedCategory)
    : recipes;

  const favoriteRecipes = recipes.filter(r => favorites.includes(r.id));

  const EmptyState = ({ message, icon: Icon = Utensils, actionLabel, onAction }: { message: string, icon?: React.ElementType, actionLabel?: string, onAction?: () => void }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-orange-100 p-6 rounded-full mb-4">
            <Icon size={48} className="text-orange-500" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{message}</h3>
        <p className="text-gray-500 max-w-sm mb-6">
            A cozinha está vazia. Que tal ser o primeiro a compartilhar uma delícia moçambicana?
        </p>
        {actionLabel && onAction && (
          <button 
              onClick={onAction}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg"
          >
              <Plus size={20} />
              {actionLabel}
          </button>
        )}
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      {/* Global Music Player Widget - Passes logic to change style on Landing */}
      <MusicPlayer isLandingPage={currentView === ViewState.LANDING} />

      {currentView === ViewState.LANDING ? (
         <div className="w-full h-full z-40">
            <LandingPage onStart={() => setCurrentView(ViewState.HOME)} />
         </div>
      ) : (
        <>
          {/* Sidebar Navigation */}
          <Sidebar 
            currentView={currentView} 
            setView={handleSetView}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            isAdmin={isAdmin}
            onAdminToggle={handleAdminToggle}
          />

          {/* Main Content Area */}
          <main className="flex-1 h-full overflow-y-auto pt-16 md:pt-0 scroll-smooth">
            <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 pb-24">
                
                {currentView === ViewState.HOME && (
                    <>
                        <header className="mb-8 flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Feed de Receitas</h1>
                                <p className="text-gray-500">O sabor autêntico de Moçambique na sua tela.</p>
                            </div>
                            {isAdmin && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-bold">MODO ADMIN</span>}
                        </header>
                        
                        {/* Placeholder para Banner Principal */}
                        <div className="mb-8">
                            <AdPlaceholder format="horizontal" />
                        </div>

                        <div className="space-y-6">
                            {recipes.length === 0 ? (
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
                                        currentUserId={currentUser.id}
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
                            <p className="text-gray-500">Receitas que você guardou com carinho.</p>
                        </header>

                        <div className="space-y-6">
                            {favoriteRecipes.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="bg-red-50 p-6 rounded-full mb-4">
                                        <Heart size={48} className="text-red-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">Ainda não tem favoritos</h3>
                                    <p className="text-gray-500 max-w-sm mb-6">
                                        Explore o feed e clique no coração nas receitas que mais gostar para salvá-las aqui.
                                    </p>
                                    <button 
                                        onClick={() => handleSetView(ViewState.HOME)}
                                        className="text-orange-600 font-semibold hover:underline"
                                    >
                                        Ir para o Feed
                                    </button>
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
                                        currentUserId={currentUser.id}
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
                                        <p className="text-sm text-gray-500 mt-1">
                                            {recipes.filter(r => r.category === cat).length} receitas
                                        </p>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <button 
                                    onClick={() => setSelectedCategory(null)}
                                    className="mb-4 text-orange-600 font-medium hover:underline flex items-center"
                                >
                                    ← Voltar para Categorias
                                </button>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedCategory}</h2>
                                    {isAdmin && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-bold">MODO ADMIN</span>}
                                </div>

                                {/* Placeholder para Banner em Categorias */}
                                <div className="mb-6">
                                    <AdPlaceholder format="horizontal" />
                                </div>
                                
                                <div className="space-y-6">
                                    {filteredRecipes.length > 0 ? (
                                        filteredRecipes.map(recipe => (
                                            <RecipeCard 
                                                key={recipe.id} 
                                                recipe={recipe} 
                                                isFavorite={favorites.includes(recipe.id)}
                                                onToggleFavorite={handleToggleFavorite}
                                                onToggleLike={handleToggleLike}
                                                onAddComment={handleAddComment}
                                                onAddReply={handleAddReply}
                                                currentUserId={currentUser.id}
                                                isAdmin={isAdmin}
                                                onDelete={handleDeleteRecipe}
                                                onEdit={handleEditRecipe}
                                            />
                                        ))
                                    ) : (
                                        <EmptyState message={`Sem receitas de ${selectedCategory}`} actionLabel="Criar Receita" onAction={() => handleSetView(ViewState.CREATE)}/>
                                    )}
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

                {currentView === ViewState.AI_CHEF && (
                    <AIChef />
                )}

                {currentView === ViewState.ABOUT && (
                    <AboutPage />
                )}

            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default App;