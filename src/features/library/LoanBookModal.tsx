import React, { useState } from 'react';
import { X, Loader2, HandHelping, User, UserPlus } from 'lucide-react';
import { useCreateLoan } from './useLibrary';
import { useUsers } from '../users/useUsers';

interface LoanBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string | null;
}

export const LoanBookModal: React.FC<LoanBookModalProps> = ({ isOpen, onClose, bookId }) => {
  const { data: users } = useUsers();
  const createLoan = useCreateLoan();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loanType, setLoanType] = useState<'user' | 'guest'>('user');

  const [formData, setFormData] = useState({
    user_id: '',
    guest_name: '',
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default 14 days
  });

  if (!isOpen || !bookId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (loanType === 'user' && !formData.user_id) {
      setError('Selecione um membro.');
      setLoading(false);
      return;
    }

    if (loanType === 'guest' && !formData.guest_name) {
      setError('Informa o nome do convidado.');
      setLoading(false);
      return;
    }

    try {
      await createLoan.mutateAsync({
        book_id: bookId,
        user_id: loanType === 'user' ? formData.user_id : null,
        guest_name: loanType === 'guest' ? formData.guest_name : null,
        due_date: formData.due_date,
      });
      onClose();
      setFormData({
        user_id: '',
        guest_name: '',
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar empréstimo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <HandHelping className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Emprestar Livro</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex bg-muted/50 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setLoanType('user')}
              className={`flex-1 flex items-center justify-center py-2 rounded-lg text-xs font-bold transition-all ${
                loanType === 'user' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'
              }`}
            >
              <User className="w-3.5 h-3.5 mr-2" />
              Membro
            </button>
            <button
              type="button"
              onClick={() => setLoanType('guest')}
              className={`flex-1 flex items-center justify-center py-2 rounded-lg text-xs font-bold transition-all ${
                loanType === 'guest' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5 mr-2" />
              Convidado
            </button>
          </div>

          <div className="space-y-4">
            {loanType === 'user' ? (
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Membro</label>
                <select
                  required
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                  value={formData.user_id}
                  onChange={e => setFormData({ ...formData, user_id: e.target.value })}
                >
                  <option value="">Selecione um membro...</option>
                  {users?.map(u => (
                    <option key={u.id} value={u.id}>{u.full_name}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Nome do Convidado</label>
                <input
                  required
                  type="text"
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Nome completo do convidado"
                  value={formData.guest_name}
                  onChange={e => setFormData({ ...formData, guest_name: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Data de Devolução</label>
              <input
                required
                type="date"
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                value={formData.due_date}
                onChange={e => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>

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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Empréstimo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
