import React, { useState } from 'react';
import { ChefHat, Send, Loader2 } from 'lucide-react';
import { generateRecipeFromIngredients } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const AIChef: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    const result = await generateRecipeFromIngredients(ingredients);
    setRecipe(result);
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg border border-purple-100 p-6">
        <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-3 rounded-full">
                <ChefHat className="w-8 h-8 text-purple-600" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-800">Chef IA Moçambicano</h2>
                <p className="text-gray-500 text-sm">Diga o que você tem na geladeira, e eu crio uma receita.</p>
            </div>
        </div>

        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Seus Ingredientes (separados por vírgula)
                </label>
                <div className="flex gap-2">
                    <input 
                        type="text" 
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="Ex: Mandioca, peixe, coco..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    />
                    <button 
                        onClick={handleGenerate}
                        disabled={loading || !ingredients}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-lg font-medium flex items-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                    </button>
                </div>
            </div>

            {recipe && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <div className="prose prose-purple prose-sm max-w-none bg-purple-50 p-6 rounded-lg">
                        {/* We use basic whitespace handling here, usually you'd use a markdown renderer */}
                        <pre className="whitespace-pre-wrap font-sans text-gray-800">{recipe}</pre>
                    </div>
                    <div className="mt-4 text-center">
                        <button 
                            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                            onClick={() => { setRecipe(''); setIngredients(''); }}
                        >
                            Criar nova receita
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AIChef;