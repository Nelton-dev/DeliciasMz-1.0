import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateRecipeFromIngredients = async (ingredients: string): Promise<string> => {
  if (!apiKey) return "Erro: Chave de API não configurada.";

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Você é um chef especialista em culinária Moçambicana.
      O usuário tem os seguintes ingredientes: ${ingredients}.
      Sugira uma receita autêntica ou criativa usando esses ingredientes com um toque moçambicano.
      
      Por favor, formate a resposta em Markdown claro com:
      - Título da Receita
      - Pequena descrição
      - Lista de Ingredientes
      - Passo a passo
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Não foi possível gerar a receita. Tente novamente.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Desculpe, ocorreu um erro ao conectar com o Chef IA.";
  }
};

export const getChefTip = async (recipeName: string): Promise<string> => {
   if (!apiKey) return "Erro: Chave de API não configurada.";
   
   try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Dê uma dica curta e profissional de um segredo culinário para melhorar o prato moçambicano: "${recipeName}". Máximo de 2 frases.`,
    });
    return response.text || "Sem dicas no momento.";
   } catch (error) {
     return "Sem dicas no momento.";
   }
}