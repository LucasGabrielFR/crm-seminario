import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Dev shortcut mapping
    let loginEmail = email;
    let loginPassword = password;
    
    if (email === 'admin' && password === 'admin') {
      loginEmail = 'admin@admin.com';
      loginPassword = 'adminadmin';
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' ? 'Credenciais inválidas' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="max-w-md w-full space-y-8 bg-card border border-border p-8 rounded-2xl shadow-2xl relative z-10 backdrop-blur-sm">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4 shadow-inner">
            <span className="text-3xl font-black">V</span>
          </div>
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
            Vocare CRM
          </h2>
          <p className="mt-2 text-sm text-muted-foreground font-medium">
            Gestão inteligente para sua casa de formação
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email-address" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                E-mail ou Usuário
              </label>
              <input
                id="email-address"
                name="email"
                type="text"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-muted/50 border border-border placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:z-10 transition-all duration-200"
                placeholder="Ex: admin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 bg-muted/50 border border-border placeholder-muted-foreground text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:z-10 transition-all duration-200"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-xl flex items-center gap-2 animate-shake">
              <span className="font-bold">!</span>
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/20 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Entrando...
                </div>
              ) : 'Acessar Sistema'}
            </button>
          </div>
        </form>
        
        <p className="text-center text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">
          Powered by Antigravity AI
        </p>
      </div>
    </div>
  );
};
