import { Recipe } from '../types';
import { supabase } from './supabase';
import { INITIAL_RECIPES } from '../constants';

// Helper para extrair dados de perfil com segurança
const getProfileData = (profileData: any) => {
    if (!profileData) return { name: 'Usuário Desconhecido', avatar: 'https://via.placeholder.com/150' };
    const profile = Array.isArray(profileData) ? profileData[0] : profileData;
    return {
        name: profile?.full_name || 'Usuário Desconhecido',
        avatar: profile?.avatar_url || 'https://via.placeholder.com/150'
    };
};

// Mapeia o retorno do Supabase para o formato Recipe da aplicação
const mapSupabaseToRecipe = (data: any): Recipe => {
    const authorProfile = getProfileData(data.profiles);

    return {
        id: data.id,
        title: data.title,
        description: data.description,
        image: data.image,
        category: data.category,
        prepTime: data.prep_time,
        servings: data.servings,
        ingredients: data.ingredients || [],
        instructions: data.instructions || [],
        author: {
            id: data.user_id,
            ...authorProfile
        },
        likedBy: data.likes ? data.likes.map((l: any) => l.user_id) : [],
        comments: data.comments ? data.comments.map((c: any) => {
            const commentProfile = getProfileData(c.profiles);
            return {
                id: c.id,
                userId: c.user_id,
                userName: commentProfile.name,
                text: c.text,
                createdAt: c.created_at,
                replies: c.replies ? c.replies.map((r: any) => {
                    const replyProfile = getProfileData(r.profiles);
                    return {
                        id: r.id,
                        userId: r.user_id,
                        userName: replyProfile.name,
                        text: r.text,
                        createdAt: r.created_at
                    };
                }) : []
            };
        }) : []
    };
};

export const storageService = {
  getRecipes: async (): Promise<Recipe[]> => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
            *,
            profiles:user_id (full_name, avatar_url),
            likes (user_id),
            comments (
                *,
                profiles:user_id (full_name),
                replies (
                    *,
                    profiles:user_id (full_name)
                )
            )
        `)
        .order('created_at', { ascending: false });

      if (error) {
          const isConnectionError = 
            error.code === 'PGRST205' || 
            error.code === '42P01' || 
            !error.code ||
            (error.message && (
                error.message.includes('Failed to fetch') || 
                error.message.includes('Network request failed') ||
                error.message.includes('TypeError')
            )) ||
            (error.details && error.details.includes('Failed to fetch'));

          if (isConnectionError) {
              console.warn("Supabase: Backend indisponível (Modo Demo Ativo).");
              return INITIAL_RECIPES;
          }
          
          console.error("Erro Supabase (Get Recipes):", error.message);
          return INITIAL_RECIPES; 
      }
      
      if (!data || data.length === 0) return INITIAL_RECIPES;

      return data.map(row => mapSupabaseToRecipe(row));
    } catch (e) {
      console.warn("Exceção ao buscar receitas (provável erro de conexão). Usando dados locais.");
      return INITIAL_RECIPES;
    }
  },

  saveRecipe: async (recipe: Recipe, userId: string): Promise<void> => {
    if (userId === 'guest') return; 
    
    try {
        // Verifica se é um UUID válido (formato 8-4-4-4-12 hex). 
        // Se for UUID, é uma receita existente no banco que estamos editando.
        // Se for Timestamp (gerado pelo AddRecipe) ou 'rec_' (inicial), é uma nova inserção.
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(recipe.id);
        
        // Dados básicos que podem ser atualizados
        const basePayload = {
            title: recipe.title,
            description: recipe.description,
            image: recipe.image,
            category: recipe.category,
            prep_time: recipe.prepTime,
            servings: recipe.servings,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
        };

        let error;
        if (isUUID) {
            // ATUALIZAR: Não enviamos 'user_id' aqui para não conflitar com RLS.
            // O RLS já garante que auth.uid() == user_id do registro.
            ({ error } = await supabase
                .from('recipes')
                .update(basePayload)
                .eq('id', recipe.id));
        } else {
            // CRIAR: Aqui precisamos definir quem é o dono (user_id).
            ({ error } = await supabase
                .from('recipes')
                .insert({
                    ...basePayload,
                    user_id: userId
                }));
        }

        if (error) throw error;
    } catch (error: any) {
        if (error.code === 'PGRST205' || error.code === '42P01' || error.message?.includes('Failed to fetch') || !error.code) {
            alert("Modo Demo: Não foi possível salvar no banco de dados (Conexão Supabase indisponível).");
        } else {
            console.error("Erro ao salvar receita:", JSON.stringify(error, null, 2));
            throw new Error(error.message || "Falha ao salvar receita");
        }
    }
  },

  deleteRecipe: async (id: string): Promise<void> => {
      if (id.startsWith('rec_')) return;
      try {
        const { error } = await supabase.from('recipes').delete().eq('id', id);
        if (error) throw error;
      } catch (error: any) {
         if (error.code !== 'PGRST205' && error.code !== '42P01' && !error.message?.includes('Failed to fetch')) {
             console.error("Erro ao apagar receita:", error.message);
         }
      }
  },

  toggleLike: async (recipeId: string, userId: string, currentLikedBy: string[]): Promise<void> => {
    if (recipeId.startsWith('rec_')) return;
    if (userId === 'guest') return;

    try {
        const hasLiked = currentLikedBy.includes(userId);
        let error;
        
        if (hasLiked) {
            ({ error } = await supabase.from('likes').delete().match({ user_id: userId, recipe_id: recipeId }));
        } else {
            ({ error } = await supabase.from('likes').insert({ user_id: userId, recipe_id: recipeId }));
        }
        
        if (error) throw error;
    } catch (error: any) {
        if (error.code !== 'PGRST205' && error.code !== '42P01' && !error.message?.includes('Failed to fetch')) {
             console.error("Erro ao curtir:", error.message);
         }
    }
  },

  addComment: async (recipeId: string, text: string, userId: string): Promise<void> => {
      if (recipeId.startsWith('rec_')) return;
      if (userId === 'guest') return;
      
      try {
        const { error } = await supabase.from('comments').insert({
            recipe_id: recipeId,
            user_id: userId,
            text: text
        });
        if (error) throw error;
      } catch (error: any) {
        if (error.code === 'PGRST205' || error.code === '42P01' || error.message?.includes('Failed to fetch')) {
            alert("Modo Demo: Comentários desativados (banco de dados offline).");
        } else {
            console.error("Erro ao comentar:", error.message);
        }
      }
  },

  addReply: async (recipeId: string, commentId: string, text: string, userId: string): Promise<void> => {
      if (recipeId.startsWith('rec_')) return;
      if (userId === 'guest') return;

      try {
        const { error } = await supabase.from('replies').insert({
            comment_id: commentId,
            user_id: userId,
            text: text
        });
        if (error) throw error;
      } catch (error: any) {
         if (error.code !== 'PGRST205' && error.code !== '42P01' && !error.message?.includes('Failed to fetch')) {
             console.error("Erro ao responder:", error.message);
         }
      }
  },

  getFavorites: (): string[] => {
    try {
      const stored = localStorage.getItem('deliciasmz_user_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  toggleFavorite: (recipeId: string): string[] => {
    const favorites = storageService.getFavorites();
    const index = favorites.indexOf(recipeId);
    let newFavorites;
    if (index >= 0) newFavorites = favorites.filter(id => id !== recipeId);
    else newFavorites = [...favorites, recipeId];
    
    localStorage.setItem('deliciasmz_user_favorites', JSON.stringify(newFavorites));
    return newFavorites;
  }
};