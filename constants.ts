import { Recipe, User } from './types';

const APP_AUTHOR: User = {
  id: 'deliciasmz_official',
  name: 'DelíciasMZ Oficial',
  avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=200&auto=format&fit=crop'
};

export const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=1000&auto=format&fit=crop";

// Lista de imagens de backup (fallback) garantidas
export const FALLBACK_IMAGES_POOL = [
  "https://images.unsplash.com/photo-1604543519969-e0d2d3122c0c?q=80&w=800&auto=format&fit=crop", // Stew
  "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop", // Chicken
  "https://images.unsplash.com/photo-1631215569837-293699b87b7a?q=80&w=800&auto=format&fit=crop", // Curry
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop", // Salad/Vegetables
  "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?q=80&w=800&auto=format&fit=crop", // Soup
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop", // BBQ
];

export const getRandomFallbackImage = () => {
  const index = Math.floor(Math.random() * FALLBACK_IMAGES_POOL.length);
  return FALLBACK_IMAGES_POOL[index];
};

export const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec_001',
    title: 'Matapa com Caranguejo',
    description: 'Um dos pratos mais emblemáticos de Moçambique. Folhas de mandioca piladas, cozidas em leite de coco e amendoim.',
    image: 'https://images.unsplash.com/photo-1604543519969-e0d2d3122c0c?q=80&w=800&auto=format&fit=crop', // Curry verde / Stew texture
    author: APP_AUTHOR,
    likedBy: [],
    category: 'Pratos Principais',
    prepTime: '1h 30m',
    servings: 4,
    ingredients: [
      '1kg de folhas de mandioca piladas',
      '500g de amendoim pilado',
      '2 cocos ralados (para leite)',
      '500g de caranguejo limpo',
      '3 dentes de alho',
      'Sal a gosto'
    ],
    instructions: [
      'Coloque as folhas de mandioca numa panela com água e deixe ferver até perderem a cor verde viva.',
      'Adicione o alho pilado e o caranguejo.',
      'Junte o leite de coco (primeira e segunda espremedura) e deixe ferver.',
      'Quando o líquido reduzir, adicione o amendoim pilado.',
      'Deixe apurar em fogo baixo mexendo sempre para não pegar no fundo até ficar cremoso.',
      'Sirva com xima ou arroz branco.'
    ],
    comments: []
  },
  {
    id: 'rec_002',
    title: 'Frango à Zambeziana',
    description: 'Frango grelhado marinado em leite de coco e especiarias, típico da província da Zambézia.',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?q=80&w=800&auto=format&fit=crop', // Grilled Chicken
    author: APP_AUTHOR,
    likedBy: [],
    category: 'Pratos Principais',
    prepTime: '2h',
    servings: 3,
    ingredients: [
      '1 frango inteiro cortado',
      '2 cocos ralados (leite espesso)',
      '4 dentes de alho',
      'Piri-piri a gosto',
      'Sal e pimenta',
      'Sumo de 1 limão'
    ],
    instructions: [
      'Tempere o frango com alho, sal, pimenta, piri-piri e limão. Deixe marinar por 1 hora.',
      'Grelhe o frango no carvão até ficar meio assado.',
      'Prepare o leite de coco espesso.',
      'Vá pincelando o frango com o leite de coco enquanto termina de assar.',
      'Sirva bem quente acompanhado de mucapata ou arroz de coco.'
    ],
    comments: []
  },
  {
    id: 'rec_003',
    title: 'Badjias (Pastéis de Feijão)',
    description: 'O petisco de rua mais famoso de Maputo. Bolinhos fritos de feijão nhemba.',
    image: 'https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?q=80&w=800&auto=format&fit=crop', // Bean Fritters/Falafel lookalike
    author: APP_AUTHOR,
    likedBy: [],
    category: 'Petiscos',
    prepTime: '45m',
    servings: 6,
    ingredients: [
      '500g de feijão nhemba',
      '1 cebola picada',
      'Salsa e coentros picados',
      '1 colher de chá de fermento',
      'Óleo para fritar',
      'Sal a gosto'
    ],
    instructions: [
      'Deixe o feijão de molho e retire a casca.',
      'Triture o feijão no pilão ou processador até virar uma pasta grossa.',
      'Misture a cebola, as ervas, o sal e o fermento.',
      'Aqueça o óleo.',
      'Forme bolinhas com a mão ou colher e frite até dourarem.',
      'Coma quente, de preferência dentro de um pão (Pão com Badjia).'
    ],
    comments: []
  },
  {
    id: 'rec_004',
    title: 'Caril de Amendoim com Camarão',
    description: 'Um molho rico e cremoso que combina o doce do amendoim com o sabor do mar.',
    image: 'https://images.unsplash.com/photo-1631215569837-293699b87b7a?q=80&w=800&auto=format&fit=crop', // Shrimp Curry
    author: APP_AUTHOR,
    likedBy: [],
    category: 'Pratos Principais',
    prepTime: '50m',
    servings: 4,
    ingredients: [
      '1kg de camarão limpo',
      '300g de amendoim torrado e moído',
      '2 tomates maduros',
      '1 cebola grande',
      'Leite de coco (opcional)',
      'Especiarias a gosto'
    ],
    instructions: [
      'Faça um refogado com cebola e tomate.',
      'Adicione o camarão e deixe cozinhar levemente.',
      'Dissolva o amendoim moído em um pouco de água morna ou leite de coco.',
      'Despeje na panela e deixe ferver em fogo baixo até o óleo do amendoim subir à superfície.',
      'Acerte o sal e sirva com arroz branco soltinho.'
    ],
    comments: []
  },
  {
    id: 'rec_005',
    title: 'Xima de Milho Branco',
    description: 'A base da alimentação moçambicana. Simples, mas essencial para acompanhar qualquer caril ou matapa.',
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=800&auto=format&fit=crop', // Fufu/Polenta white
    author: APP_AUTHOR,
    likedBy: [],
    category: 'Pratos Principais',
    prepTime: '20m',
    servings: 4,
    ingredients: [
      '500g de farinha de milho branco',
      '1 litro de água',
      'Sal (opcional)'
    ],
    instructions: [
      'Coloque a água para ferver numa panela.',
      'Quando ferver, retire uma chávena de água quente e reserve.',
      'Vá adicionando a farinha aos poucos, mexendo vigorosamente com uma colher de pau (pau de xima).',
      'Adicione a água reservada se ficar muito dura.',
      'Cozinhe por alguns minutos, batendo a massa contra as paredes da panela até ficar lisa e soltar do fundo.',
      'Sirva quente.'
    ],
    comments: []
  }
];