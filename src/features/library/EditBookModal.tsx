import React, { useState, useEffect } from 'react';
import { X, Loader2, Pencil, PlusCircle, Check, AlertCircle } from 'lucide-react';
import { useBookCategories, useUpdateBook, Book } from './useLibrary';
import { AddCategoryModal } from './AddCategoryModal';

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}

export const EditBookModal: React.FC<EditBookModalProps> = ({ isOpen, onClose, book }) => {
  const { data: categories } = useBookCategories();
  const updateBook = useUpdateBook();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    total_quantity: 1,
    location: '',
    isbn: '',
    categories: [] as string[],
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        total_quantity: book.total_quantity || 1,
        location: book.location || '',
        isbn: book.isbn || '',
        categories: book.book_category_junction?.map(j => j.category_id) || [],
      });
    }
  }, [book]);

  if (!isOpen || !book) return null;

  const toggleCategory = (catId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(catId)
        ? prev.categories.filter(id => id !== catId)
        : [...prev.categories, catId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.categories.length === 0) {
      setError('Selecione pelo menos uma categoria.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { categories: selectedCats, ...bookData } = formData;
      await updateBook.mutateAsync({
        id: book.id,
        ...bookData,
        categories: selectedCats,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar livro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
        <div className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
          <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Pencil className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Editar Livro</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Título do Livro</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Autor</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.author}
                    onChange={e => setFormData({ ...formData, author: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Quantidade</label>
                    <input
                      required
                      type="number"
                      min="1"
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={formData.total_quantity}
                      onChange={e => setFormData({ ...formData, total_quantity: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Localização</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">ISBN (Opcional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    value={formData.isbn}
                    onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Categorias (Mín. 1)</label>
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="flex items-center text-[10px] font-black uppercase tracking-widest text-primary hover:opacity-80 transition-all gap-1"
                  >
                    <PlusCircle className="w-3 h-3" />
                    Nova Categoria
                  </button>
                </div>
                
                <div className="flex-1 bg-muted/30 border border-border rounded-2xl p-4 overflow-y-auto max-h-[300px] space-y-2">
                  {categories?.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border transition-all ${
                        formData.categories.includes(cat.id)
                          ? 'bg-primary/10 border-primary text-primary shadow-sm'
                          : 'bg-background border-border text-muted-foreground hover:border-primary/30'
                      }`}
                    >
                      <span className="text-sm font-bold">{cat.name}</span>
                      {formData.categories.includes(cat.id) && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
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
      <AddCategoryModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
      />
    </>
  );
};
