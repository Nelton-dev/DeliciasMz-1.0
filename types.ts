export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface Reply {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
  replies: Reply[];
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  author: User;
  likedBy: string[]; // Changed from 'likes: number' to track user IDs
  category: string;
  prepTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  comments: Comment[];
}

export enum ViewState {
  LANDING = 'LANDING',
  HOME = 'HOME',
  CATEGORIES = 'CATEGORIES',
  FAVORITES = 'FAVORITES',
  CREATE = 'CREATE',
  AI_CHEF = 'AI_CHEF',
  ABOUT = 'ABOUT'
}

export const CATEGORIES = [
  "Pratos Principais",
  "Sobremesas",
  "Petiscos",
  "Bebidas",
  "Vegetariano"
];