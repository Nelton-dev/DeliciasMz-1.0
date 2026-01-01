import React, { useState } from 'react';
import { Heart, Clock, Users, ChevronDown, ChevronUp, MessageCircle, Share2, Sparkles, Trash2, Pencil, ImagePlus, Send, Reply as ReplyIcon } from 'lucide-react';
import { Recipe } from '../types';
import { getChefTip } from '../services/geminiService';
import { getRandomFallbackImage } from '../constants';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleLike: (id: string) => void;
  onAddComment: (id: string, text: string) => void;
  onAddReply: (recipeId: string, commentId: string, text: string) => void;
  currentUserId: string;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
  onEdit?: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
  recipe, 
  isFavorite, 
  onToggleFavorite,
  onToggleLike,
  onAddComment,
  onAddReply,
  currentUserId,
  isAdmin, 
  onDelete, 
  onEdit 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [tip, setTip] = useState<string | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);
  
  // Controle de imagem e erro
  const [imageSrc, setImageSrc] = useState(recipe.image);
  const [imgError, setImgError] = useState(false);
  const [triedFallback, setTriedFallback] = useState(false);
  
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const hasLiked = recipe.likedBy.includes(currentUserId);
  const commentsCount = recipe.comments ? recipe.comments.length + recipe.comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0) : 0;
  
  // VERIFICAÇÃO DE PERMISSÃO
  const isGuest = currentUserId === 'guest';
  const isOwner = currentUserId && recipe.author.id === currentUserId;
  const canEdit = isAdmin || isOwner;

  const handleGetTip = async () => {
    if (tip) return;
    setLoadingTip(true);
    const generatedTip = await getChefTip(recipe.title);
    setTip(generatedTip);
    setLoadingTip(false);
  };

  const handleImageError = () => {
    if (!triedFallback) {
      // Se a imagem original falhar, tenta uma imagem aleatória de fallback do pool
      setImageSrc(getRandomFallbackImage());
      setTriedFallback(true);
    } else {
      // Se o fallback também falhar, mostra o ícone genérico
      setImgError(true);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newComment.trim() || isGuest) return;
      onAddComment(recipe.id, newComment);
      setNewComment('');
  };

  const handlePostReply = (commentId: string) => {
      const text = replyText[commentId];
      if (!text?.trim() || isGuest) return;
      onAddReply(recipe.id, commentId, text);
      setReplyText(prev => ({...prev, [commentId]: ''}));
      setReplyingTo(null);
  };

  const formatDate = (dateString: string) => {
      try {
          return new Date(dateString).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
      } catch {
          return '';
      }
  };

  const sortedComments = [...(recipe.comments || [])].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6 transition-all hover:shadow-md relative">
      
      {/* Admin / Owner Controls */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
            {canEdit && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onEdit?.(recipe); }}
                    className="bg-white/90 text-gray-700 p-2 rounded-full shadow-lg hover:bg-orange-100 hover:text-orange-600 transition backdrop-blur-sm"
                    title="Editar Receita"
                >
                    <Pencil size={16} />
                </button>
            )}
            {isAdmin && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete?.(recipe.id); }}
                    className="bg-white/90 text-red-600 p-2 rounded-full shadow-lg hover:bg-red-100 transition backdrop-blur-sm"
                    title="Apagar Receita (Admin)"
                >
                    <Trash2 size={16} />
                </button>
            )}
      </div>

      {/* Header / Image */}
      <div className="relative h-64 overflow-hidden group bg-gray-100 flex items-center justify-center">
        {imgError ? (
            <div className={`flex flex-col items-center justify-center w-full h-full text-gray-400 gap-3 ${canEdit ? 'cursor-pointer hover:bg-gray-200' : ''}`}
                 onClick={() => canEdit && onEdit?.(recipe)}
            >
                <div className="bg-white p-4 rounded-full shadow-sm">
                    <ImagePlus size={32} className="text-orange-500" />
                </div>
                <div className="text-center px-4">
                    <span className="text-sm font-medium text-gray-600 block">Foto indisponível</span>
                    {canEdit && <span className="text-xs text-orange-600 font-bold mt-1">Clique para carregar a sua foto</span>}
                </div>
            </div>
        ) : (
            <img 
                src={imageSrc} 
                alt={recipe.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={handleImageError}
            />
        )}
        
        {!imgError && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm uppercase tracking-wide">
                {recipe.category}
            </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
            <div>
                <h3 className="text-xl font-bold text-gray-900 leading-tight">{recipe.title}</h3>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                    Publicado por <span className="font-semibold text-gray-700 ml-1">{recipe.author.name} {isOwner ? '(Você)' : ''}</span>
                </p>
            </div>
            {/* Social Like Button */}
            <button 
                onClick={() => onToggleLike(recipe.id)}
                className="flex flex-col items-center gap-1 group transition-transform active:scale-95"
            >
                <Heart 
                    className={`w-6 h-6 transition-colors ${hasLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-red-400'}`} 
                />
                <span className={`text-xs font-medium ${hasLiked ? 'text-red-500' : 'text-gray-500'}`}>
                    {recipe.likedBy.length}
                </span>
            </button>
        </div>

        <p className="text-gray-600 mt-2 line-clamp-2 text-sm">{recipe.description}</p>

        {/* Stats Row */}
        <div className="flex items-center gap-6 mt-4 pb-4 border-b border-gray-100">
            <div className="flex items-center text-gray-500 text-sm">
                <Clock size={16} className="mr-2 text-orange-500" />
                {recipe.prepTime}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
                <Users size={16} className="mr-2 text-orange-500" />
                {recipe.servings} porções
            </div>
        </div>

        {/* Expandable Details */}
        {isExpanded && (
            <div className="mt-4 animate-fadeIn">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Ingredientes</h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            {recipe.ingredients.map((ing, idx) => (
                                <li key={idx}>{ing}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Modo de Preparo</h4>
                        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                            {recipe.instructions.map((inst, idx) => (
                                <li key={idx} className="pl-2">{inst}</li>
                            ))}
                        </ol>
                    </div>
                </div>

                {/* AI Tip Section */}
                <div className="mt-6 bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center justify-between">
                        <h5 className="text-purple-800 font-semibold text-sm flex items-center">
                            <Sparkles size={16} className="mr-2" />
                            Dica do Chef IA
                        </h5>
                        {!tip && (
                            <button 
                                onClick={handleGetTip}
                                disabled={loadingTip}
                                className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded hover:bg-purple-300 disabled:opacity-50"
                            >
                                {loadingTip ? 'Gerando...' : 'Ver Dica'}
                            </button>
                        )}
                    </div>
                    {tip && (
                        <p className="text-sm text-purple-700 mt-2 italic">
                            "{tip}"
                        </p>
                    )}
                </div>
            </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between mt-4 pt-2">
            <div className="flex gap-4">
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center text-gray-500 hover:text-orange-600 transition"
                >
                    <MessageCircle size={20} className="mr-1" />
                    <span className="text-sm font-medium">{commentsCount}</span>
                </button>
                <button
                    className="flex items-center text-gray-500 hover:text-orange-600 transition"
                    onClick={() => {
                        // Mock share
                        alert('Link copiado para a área de transferência!');
                    }}
                >
                    <Share2 size={20} className="mr-1" />
                    <span className="text-sm font-medium">Partilhar</span>
                </button>
            </div>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-gray-400 hover:text-gray-600 transition"
            >
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-gray-50 border-t border-gray-100 p-5 animate-fadeIn">
            <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Comentários</h4>

            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {sortedComments.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-4">Seja o primeiro a comentar!</p>
                ) : (
                    sortedComments.map(comment => (
                        <div key={comment.id} className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-semibold text-gray-800 text-sm">{comment.userName}</span>
                                <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{comment.text}</p>

                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                                <div className="ml-4 pl-3 border-l-2 border-orange-100 space-y-2 mt-2">
                                    {comment.replies.map(reply => (
                                        <div key={reply.id} className="bg-gray-50 p-2 rounded text-xs">
                                            <div className="flex justify-between">
                                                <span className="font-medium text-gray-700">{reply.userName}</span>
                                                <span className="text-gray-400 scale-90">{formatDate(reply.createdAt)}</span>
                                            </div>
                                            <p className="text-gray-600 mt-1">{reply.text}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Reply Action */}
                            <div className="mt-2 flex items-center gap-2">
                                {replyingTo === comment.id && !isGuest ? (
                                    <div className="flex items-center w-full gap-2 animate-fadeIn">
                                        <input
                                            autoFocus
                                            className="flex-1 bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                                            placeholder="Responda..."
                                            value={replyText[comment.id] || ''}
                                            onChange={(e) => setReplyText({...replyText, [comment.id]: e.target.value})}
                                            onKeyDown={(e) => e.key === 'Enter' && handlePostReply(comment.id)}
                                        />
                                        <button onClick={() => handlePostReply(comment.id)} className="text-orange-600">
                                            <Send size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    !isGuest && (
                                        <button
                                            onClick={() => setReplyingTo(comment.id)}
                                            className="text-xs text-gray-400 hover:text-orange-600 flex items-center gap-1 transition"
                                        >
                                            <ReplyIcon size={12} /> Responder
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* New Comment Input */}
            <form onSubmit={handlePostComment} className="flex gap-2 relative">
                <input
                    className={`flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition
                        ${isGuest ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
                    `}
                    placeholder={isGuest ? "Faça login para comentar..." : "Adicione um comentário..."}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={isGuest}
                />
                <button
                    type="submit"
                    disabled={!newComment.trim() || isGuest}
                    className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;