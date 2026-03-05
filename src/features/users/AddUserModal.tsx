import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useFormativeStages } from './useUsers';
import { supabase } from '../../lib/supabase';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { data: stages } = useFormativeStages();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    cpf: '',
    role: 'seminarista',
    is_librarian: false,
    stage_id: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Clean CPF (numbers only)
    const cleanCpf = formData.cpf.replace(/\D/g, '');
    
    if (cleanCpf.length !== 11) {
      setError('O CPF deve ter 11 dígitos.');
      setLoading(false);
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Sessão não encontrada. Por favor, faça login novamente.');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-create-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ 
            ...formData, 
            cpf: cleanCpf,
            password: cleanCpf
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Erro ${response.status}: ${response.statusText}`);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error creating user:', err);
      // If it's the specific "Invalid JWT" error from Supabase Gateway
      if (err.message.includes('Invalid JWT') || err.message.includes('401')) {
        setError('Sessão expirada. Por favor, saia do sistema e entre novamente.');
      } else {
        setError(err.message || 'Erro ao criar usuário');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
          <h2 className="text-xl font-bold tracking-tight">Novo Membro</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nome Completo</label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                placeholder="Ex: João Silva"
                value={formData.full_name}
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">E-mail</label>
              <input
                required
                type="email"
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">CPF (Senha Padrão)</label>
              <input
                required
                type="text"
                maxLength={14}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={e => setFormData({ ...formData, cpf: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Função</label>
              <select
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="seminarista">Seminarista</option>
                <option value="formador">Formador</option>
                <option value="professor">Professor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="flex items-center space-x-2 pt-6">
              <input
                type="checkbox"
                id="is_librarian"
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20"
                checked={formData.is_librarian}
                onChange={e => setFormData({ ...formData, is_librarian: e.target.checked })}
              />
              <label htmlFor="is_librarian" className="text-sm font-bold text-muted-foreground cursor-pointer">
                Atribuir função de Bibliotecário
              </label>
            </div>
          </div>

          {formData.role === 'seminarista' && (
            <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Etapa Formativa</label>
              <select
                required
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer"
                value={formData.stage_id}
                onChange={e => setFormData({ ...formData, stage_id: e.target.value })}
              >
                <option value="">Selecione uma etapa...</option>
                {stages?.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.name}</option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="font-bold">!</span>
              {error}
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-border rounded-xl font-bold hover:bg-muted transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar Membro'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
