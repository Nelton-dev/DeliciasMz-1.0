import { createClient } from '@supabase/supabase-js';

// URL do seu projeto Supabase (já configurado)
const supabaseUrl = 'https://nbdgmlnqsddpmrjoqjuq.supabase.co';

// --- CONFIGURAÇÃO DA CHAVE ---
// Tenta pegar do ambiente (.env). Se não existir, use a variável manual abaixo.
const envKey = process.env.SUPABASE_KEY;

// Chave fornecida manualmente
const manualKey = 'sb_publishable_McixqRkmEMe3YSk3nmFiyw_t9p3Li4C'; 

// Lógica de seleção da chave
const apiKey = envKey || manualKey;

// Verificação simples se a chave parece válida (não é vazia e tem um tamanho mínimo)
export const isSupabaseConfigured = !!apiKey && apiKey.length > 10 && apiKey !== 'MISSING_SUPABASE_KEY_PLACEHOLDER';

const supabaseAnonKey = isSupabaseConfigured ? apiKey : 'MISSING_SUPABASE_KEY_PLACEHOLDER';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);