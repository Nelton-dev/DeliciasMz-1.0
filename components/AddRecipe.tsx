import React, { useState, useEffect } from 'react';
import { Camera, Save, XCircle } from 'lucide-react';
import { Recipe, CATEGORIES } from '../types';
import { FALLBACK_IMAGE } from '../constants';

interface AddRecipeProps {
  initialRecipe?: Recipe | null;
  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
}

const AddRecipe: React.FC<AddRecipeProps> = ({ initialRecipe, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Load initial data if editing
  useEffect(() => {
    if (initialRecipe) {
      setTitle(initialRecipe.title);
      setDescription(initialRecipe.description);
      setCategory(initialRecipe.category);
      setIngredients(initialRecipe.ingredients.join('\n'));
      setInstructions(initialRecipe.instructions.join('\n'));
      setImagePreview(initialRecipe.image);
    } else {
        // Reset if adding new
      setTitle('');
      setDescription('');
      setCategory(CATEGORIES[0]);
      setIngredients('');
      setInstructions('');
      setImagePreview(null);
    }
  }, [initialRecipe]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setImagePreview(null);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRecipe: Recipe = {
      id: initialRecipe ? initialRecipe.id : Date.now().toString(),
      title,
      description,
      category,
      // Se não houver imagem, usa o fallback
      image: imagePreview || FALLBACK_IMAGE,
      author: initialRecipe ? initialRecipe.author : {
        id: 'me',
        name: 'Você',
        avatar: 'https://picsum.photos/200'
      },
      // Preserva likes/comments antigos se editando, ou inicializa vazios
      likedBy: initialRecipe ? initialRecipe.likedBy : [], 
      prepTime: initialRecipe ? initialRecipe.prepTime : 'N/A',
      servings: initialRecipe ? initialRecipe.servings : 2,
      ingredients: ingredients.split('\n').filter(i => i.trim()),
      instructions: instructions.split('\n').filter(i => i.trim()),
      comments: initialRecipe ? initialRecipe.comments : []
    };

    onSave(newRecipe);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {initialRecipe ? 'Editar Receita' : 'Nova Receita'}
      </h2>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        
        {/* Image Upload */}
        <div className="relative">
            <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg h-56 transition relative overflow-hidden group
                ${imagePreview ? 'border-orange-300 bg-gray-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 cursor-pointer'}`}>
                
                <input 
                    type="file" 
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                    onChange={handleImageChange}
                    accept="image/*"
                />
                
                {imagePreview ? (
                    <>
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-20 pointer-events-none">
                            <p className="text-white font-medium">Clique para trocar a foto</p>
                        </div>
                        <button 
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 z-30 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition"
                            title="Remover foto"
                        >
                            <XCircle size={20} />
                        </button>
                    </>
                ) : (
                    <div className="text-center text-gray-500 p-4">
                        <div className="bg-white p-3 rounded-full shadow-sm inline-block mb-3">
                            <Camera className="w-8 h-8 text-orange-500" />
                        </div>
                        <h3 className="font-semibold text-gray-700">Adicionar Foto do Prato</h3>
                        <span className="text-sm text-gray-400 mt-1 block">Toque aqui para carregar do seu dispositivo</span>
                    </div>
                )}
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Prato</label>
            <input 
                required
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ex: Matapa de Siri"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
            <select 
                className="w-full border border-gray-300 rounded-md p-3"
                value={category}
                onChange={e => setCategory(e.target.value)}
            >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição Curta</label>
            <textarea 
                className="w-full border border-gray-300 rounded-md p-3 h-20"
                placeholder="Conte um pouco sobre este prato..."
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ingredientes (um por linha)</label>
            <textarea 
                required
                className="w-full border border-gray-300 rounded-md p-3 h-32 font-mono text-sm"
                placeholder="- 1kg de arroz&#10;- 2 cebolas"
                value={ingredients}
                onChange={e => setIngredients(e.target.value)}
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modo de Preparo (um passo por linha)</label>
            <textarea 
                required
                className="w-full border border-gray-300 rounded-md p-3 h-32 font-mono text-sm"
                placeholder="1. Lave bem as verduras&#10;2. Refogue a cebola"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
            />
        </div>

        <div className="flex gap-4 pt-4">
            <button 
                type="button" 
                onClick={onCancel}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50"
            >
                Cancelar
            </button>
            <button 
                type="submit" 
                className="flex-1 py-3 bg-orange-600 text-white rounded-md font-medium hover:bg-orange-700 flex justify-center items-center gap-2"
            >
                <Save size={20} />
                {initialRecipe ? 'Salvar Alterações' : 'Publicar Receita'}
            </button>
        </div>

      </form>
    </div>
  );
};

export default AddRecipe;