import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { ChefHat, AlertCircle, User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

interface LoginProps {
  onGuestLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onGuestLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) {
        setError("Supabase não configurado. Adicione a chave API no arquivo services/supabase.ts ou use o modo Visitante.");
        return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
        if (isRegistering) {
            // REGISTRO
            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });
            
            if (signUpError) {
                // Supabase code for duplicate user is usually 422 or message contains "already registered"
                if (signUpError.message.includes("already registered") || signUpError.status === 422) {
                    throw new Error("Este usuário já existe. O e-mail informado já está cadastrado.");
                }
                throw signUpError;
            }
            
            setSuccessMsg("Conta criada com sucesso! Por favor, verifique seu e-mail para confirmar antes de entrar.");
            setIsRegistering(false); 
        } else {
            // LOGIN
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                if (signInError.message.includes("Invalid login")) {
                    throw new Error("E-mail ou senha incorretos.");
                }
                if (signInError.message.includes("Email not confirmed")) {
                    throw new Error("Por favor, confirme seu e-mail antes de entrar.");
                }
                throw signInError;
            }
        }
    } catch (err: any) {
        setError(err.message || "Ocorreu um erro na autenticação. Tente novamente.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden px-4">
      {/* Background Decorativo */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 blur-sm"
            alt="Mozambican Food"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative z-10 text-center border border-gray-100">
        <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <ChefHat size={32} className="text-orange-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">DelíciasMZ</h2>
        <p className="text-gray-500 mb-6">
            {isRegistering ? "Crie sua conta para compartilhar sabores." : "Entre para acessar suas receitas favoritas."}
        </p>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 flex items-center gap-2 text-left animate-pulse border border-red-100">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
            </div>
        )}

        {successMsg && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4 text-left border border-green-200 shadow-sm">
                <strong>Sucesso!</strong> {successMsg}
            </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4 text-left">
            {isRegistering && (
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1 ml-1">Nome Completo</label>
                    <div className="relative">
                        <User size={18} className="absolute left-3 top-3 text-gray-400" />
                        <input
                            type="text"
                            required={isRegistering}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                            placeholder="Ex: Maria Machava"
                        />
                    </div>
                </div>
            )}

            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 ml-1">E-mail</label>
                <div className="relative">
                    <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                        placeholder="seu@email.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1 ml-1">Senha</label>
                <div className="relative">
                    <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition"
                        placeholder="Mínimo 6 caracteres"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading || !isSupabaseConfigured}
                className={`w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2 mt-4
                    ${(!isSupabaseConfigured || loading) ? 'opacity-70 cursor-not-allowed' : ''}
                `}
            >
                {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <>
                        {isRegistering ? 'Criar Conta' : 'Entrar'}
                        <ArrowRight size={18} />
                    </>
                )}
            </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
            {isRegistering ? 'Já tem uma conta?' : 'Ainda não tem conta?'}
            <button 
                onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError(null);
                    setSuccessMsg(null);
                }}
                className="text-orange-600 font-bold ml-1 hover:underline focus:outline-none"
            >
                {isRegistering ? 'Fazer Login' : 'Cadastre-se'}
            </button>
        </div>

        <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OU</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button
            onClick={onGuestLogin}
            type="button"
            className="w-full bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition text-sm"
        >
            <User size={16} />
            <span>Entrar como Visitante</span>
        </button>

        {!isSupabaseConfigured && (
             <p className="mt-4 text-[10px] text-red-500 bg-red-50 p-3 rounded border border-red-200">
                ⚠️ <strong>Atenção:</strong> Banco de dados desconectado.<br/>
                Para login funcionar, adicione a <code>SUPABASE_KEY</code> no arquivo <code>services/supabase.ts</code>.
             </p>
        )}
      </div>
    </div>
  );
};

export default Login;