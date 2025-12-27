import { Recipe, Comment, Reply } from '../types';
import { INITIAL_RECIPES } from '../constants';

const RECIPES_KEY = 'deliciasmz_recipes_v6_clean'; // Chave atualizada para V6 para atualizar imagens
const FAVORITES_KEY = 'deliciasmz_user_favorites';

export const storageService = {
  // --- Recipes (Database Simulation) ---
  
  getRecipes: (): Recipe[] => {
    try {
      const stored = localStorage.getItem(RECIPES_KEY);
      if (!stored) {
        // Se não houver dados, carrega as receitas iniciais (seed data)
        localStorage.setItem(RECIPES_KEY, JSON.stringify(INITIAL_RECIPES));
        return INITIAL_RECIPES;
      }
      const recipes = JSON.parse(stored);
      // Migration check (garante estrutura correta)
      return recipes.map((r: any) => ({
         ...r,
         likedBy: Array.isArray(r.likedBy) ? r.likedBy : [], 
         comments: Array.isArray(r.comments) ? r.comments : [] 
      }));
    } catch (e) {
      console.error("Erro ao ler banco de dados", e);
      return INITIAL_RECIPES;
    }
  },

  saveRecipe: (recipe: Recipe): Recipe[] => {
    const recipes = storageService.getRecipes();
    const existingIndex = recipes.findIndex(r => r.id === recipe.id);
    
    let updatedRecipes;
    if (existingIndex >= 0) {
      // Update
      updatedRecipes = [...recipes];
      updatedRecipes[existingIndex] = recipe;
    } else {
      // Create
      updatedRecipes = [recipe, ...recipes];
    }
    
    localStorage.setItem(RECIPES_KEY, JSON.stringify(updatedRecipes));
    return updatedRecipes;
  },

  deleteRecipe: (id: string): Recipe[] => {
    const recipes = storageService.getRecipes();
    const updatedRecipes = recipes.filter(r => r.id !== id);
    localStorage.setItem(RECIPES_KEY, JSON.stringify(updatedRecipes));
    return updatedRecipes;
  },

  // --- Likes (Social Proof) ---
  
  toggleLike: (recipeId: string, userId: string): Recipe[] => {
    const recipes = storageService.getRecipes();
    const recipeIndex = recipes.findIndex(r => r.id === recipeId);
    
    if (recipeIndex === -1) return recipes;

    const recipe = recipes[recipeIndex];
    const userLikeIndex = recipe.likedBy.indexOf(userId);
    
    let newLikedBy;
    if (userLikeIndex >= 0) {
        // Remove like (unlike)
        newLikedBy = recipe.likedBy.filter(id => id !== userId);
    } else {
        // Add like
        newLikedBy = [...recipe.likedBy, userId];
    }

    const updatedRecipe = { ...recipe, likedBy: newLikedBy };
    const updatedRecipes = [...recipes];
    updatedRecipes[recipeIndex] = updatedRecipe;

    localStorage.setItem(RECIPES_KEY, JSON.stringify(updatedRecipes));
    return updatedRecipes;
  },

  // --- Comments ---

  addComment: (recipeId: string, text: string, user: {id: string, name: string}): Recipe[] => {
      const recipes = storageService.getRecipes();
      const recipeIndex = recipes.findIndex(r => r.id === recipeId);
      
      if (recipeIndex === -1) return recipes;
      
      const newComment: Comment = {
          id: Date.now().toString(),
          userId: user.id,
          userName: user.name,
          text,
          createdAt: new Date().toISOString(),
          replies: []
      };

      const updatedRecipe = { 
          ...recipes[recipeIndex], 
          comments: [...(recipes[recipeIndex].comments || []), newComment] 
      };
      
      const updatedRecipes = [...recipes];
      updatedRecipes[recipeIndex] = updatedRecipe;
      localStorage.setItem(RECIPES_KEY, JSON.stringify(updatedRecipes));
      return updatedRecipes;
  },

  addReply: (recipeId: string, commentId: string, text: string, user: {id: string, name: string}): Recipe[] => {
    const recipes = storageService.getRecipes();
    const recipeIndex = recipes.findIndex(r => r.id === recipeId);
    if (recipeIndex === -1) return recipes;

    const recipe = recipes[recipeIndex];
    const commentIndex = recipe.comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) return recipes;

    const newReply: Reply = {
        id: Date.now().toString() + '_r',
        userId: user.id,
        userName: user.name,
        text,
        createdAt: new Date().toISOString()
    };

    const updatedComments = [...recipe.comments];
    updatedComments[commentIndex] = {
        ...updatedComments[commentIndex],
        replies: [...(updatedComments[commentIndex].replies || []), newReply]
    };

    const updatedRecipes = [...recipes];
    updatedRecipes[recipeIndex] = { ...recipe, comments: updatedComments };
    localStorage.setItem(RECIPES_KEY, JSON.stringify(updatedRecipes));
    return updatedRecipes;
  },


  // --- Favorites (User Bookmarks - Private) ---

  getFavorites: (): string[] => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite: (recipeId: string): string[] => {
    const favorites = storageService.getFavorites();
    const index = favorites.indexOf(recipeId);
    
    let newFavorites;
    if (index >= 0) {
      newFavorites = favorites.filter(id => id !== recipeId);
    } else {
      newFavorites = [...favorites, recipeId];
    }
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    return newFavorites;
  }
};