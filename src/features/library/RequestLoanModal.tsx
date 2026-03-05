import React, { useState } from 'react';
import { X, Loader2, Send } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useCreateRequest } from './useLibrary';

interface RequestLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string | null;
}

export const RequestLoanModal: React.FC<RequestLoanModalProps> = ({ isOpen, onClose, bookId }) => {
  const { user } = useAuth();
  const createRequest = useCreateRequest();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  if (!isOpen || !bookId) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      await createRequest.mutateAsync({
        book_id: bookId,
        user_id: user.id,
        notes: notes.trim() || null,
        status: 'pending'
      });
      onClose();
      setNotes('');
    } catch (err) {
      alert('Erro ao enviar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
          <h2 className="text-xl font-bold tracking-tight">Solicitar Empréstimo</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Sua solicitação será enviada ao bibliotecário. Você receberá uma notificação quando for aprovada para retirada.
            </p>
            
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Observações (Opcional)</label>
              <textarea
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none min-h-[100px] resize-none"
                placeholder="Ex: Preciso para o trabalho de Teoria do Conhecimento..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>

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
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  <Send className="w-4 h-4" />
                  Enviar Solicitação
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
