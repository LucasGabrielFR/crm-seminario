import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useFormativeStages, Profile } from './useUsers';
import { supabase } from '../../lib/supabase';

interface EditUserModalProps {
  isOpen: boolean;
  user: Profile | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, user, onClose, onSuccess }) => {
  const { data: stages } = useFormativeStages();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    cpf: '',
    role: 'seminarista',
    is_librarian: false,
    is_teacher: false,
    stage_id: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        full_name: user.full_name || '',
        cpf: user.cpf || '',
        role: user.role || 'seminarista',
        is_librarian: user.is_librarian || false,
        is_teacher: user.is_teacher || false,
        stage_id: user.stage_id || '',
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanCpf = formData.cpf.replace(/\D/g, '');
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('Sessão não encontrada.');
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
            action: 'update',
            userId: user.id,
            ...formData, 
            stage_id: formData.role === 'seminarista' ? formData.stage_id : null,
            cpf: cleanCpf
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Erro ${response.status}`);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error updating user:', err);
      setError(err.message || 'Erro ao atualizar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
          <h2 className="text-xl font-bold tracking-tight">Editar Membro</h2>
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
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">CPF</label>
              <input
                required
                type="text"
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                value={formData.cpf}
                onChange={e => setFormData({ ...formData, cpf: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Função</label>
              <select
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as any })}
              >
                <option value="seminarista">Seminarista</option>
                <option value="formador">Formador</option>
                <option value="professor">Professor</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="flex flex-col space-y-3 pt-4">
              <div className="flex items-center space-x-2">
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_teacher"
                  className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20"
                  checked={formData.is_teacher}
                  onChange={e => setFormData({ ...formData, is_teacher: e.target.checked })}
                />
                <label htmlFor="is_teacher" className="text-sm font-bold text-muted-foreground cursor-pointer">
                  Atribuir acesso de Professor
                </label>
              </div>
            </div>
          </div>

          {formData.role === 'seminarista' && (
            <div className="space-y-1">
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
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-xl">
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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
