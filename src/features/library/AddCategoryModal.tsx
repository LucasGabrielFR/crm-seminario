import React, { useState } from 'react';
import { X, Loader2, Plus, AlertCircle, Check } from 'lucide-react';
import { useBookCategories, useCreateCategory } from './useLibrary';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ isOpen, onClose }) => {
  const { data: categories } = useBookCategories();
  const createCategory = useCreateCategory();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [similarCategories, setSimilarCategories] = useState<string[]>([]);
  const [confirmedSimilar, setConfirmedSimilar] = useState(false);

  if (!isOpen) return null;

  const checkSimilarity = (newName: string) => {
    if (!categories) return [];
    const normalized = newName.toLowerCase().trim();
    return categories
      .filter(c => {
        const catName = c.name.toLowerCase();
        return catName.includes(normalized) || normalized.includes(catName);
      })
      .map(c => c.name);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    setConfirmedSimilar(false);
    if (val.length > 2) {
      setSimilarCategories(checkSimilarity(val));
    } else {
      setSimilarCategories([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (similarCategories.length > 0 && !confirmedSimilar) {
      setConfirmedSimilar(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createCategory.mutateAsync(name.trim());
      setName('');
      setSimilarCategories([]);
      setConfirmedSimilar(false);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar categoria');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-background/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-sm rounded-3xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-5 border-b border-border flex justify-between items-center bg-muted/30">
          <h2 className="text-lg font-bold tracking-tight">Nova Categoria</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nome da Categoria</label>
            <input
              required
              autoFocus
              type="text"
              className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
              placeholder="Ex: Patrística"
              value={name}
              onChange={e => handleNameChange(e.target.value)}
            />
          </div>

          {similarCategories.length > 0 && (
            <div className={`p-4 rounded-xl border animate-in slide-in-from-top-2 duration-300 ${
              confirmedSimilar ? 'bg-amber-500/10 border-amber-500/20' : 'bg-blue-500/10 border-blue-500/20'
            }`}>
              <div className="flex items-start gap-3">
                <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${confirmedSimilar ? 'text-amber-500' : 'text-blue-500'}`} />
                <div className="space-y-2">
                  <p className="text-xs font-bold leading-tight">
                    {confirmedSimilar 
                      ? 'Deseja criar mesmo assim?' 
                      : 'Encontramos categorias semelhantes:'}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {similarCategories.map(cat => (
                      <span key={cat} className="text-[10px] bg-background/50 px-2 py-0.5 rounded-lg border border-border font-bold">
                        {cat}
                      </span>
                    ))}
                  </div>
                  {confirmedSimilar && (
                    <p className="text-[10px] text-muted-foreground italic">Clique em "Confirmar e Criar" para prosseguir.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all flex justify-center items-center gap-2 ${
              confirmedSimilar 
                ? 'bg-amber-500 text-white shadow-amber-500/20 hover:bg-amber-600' 
                : 'bg-primary text-primary-foreground shadow-primary/20 hover:opacity-90'
            }`}
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              confirmedSimilar ? (
                <>
                  <Check className="w-4 h-4" />
                  Confirmar e Criar
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Criar Categoria
                </>
              )
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
