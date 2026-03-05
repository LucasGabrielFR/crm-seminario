import React, { useState } from 'react';
import { Search, Book as BookIcon, MapPin, Tag, HandHelping, Pencil } from 'lucide-react';
import { useBooks, Book } from './useLibrary';

interface BooksListProps {
  onLoan: (bookId: string) => void;
  onEdit: (book: Book) => void;
}

export const BooksList: React.FC<BooksListProps> = ({ onLoan, onEdit }) => {
  const { data: books, isLoading } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBooks = books?.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="font-bold">Carregando acervo...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input 
          type="text"
          placeholder="Buscar título ou autor..."
          className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks?.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-border rounded-3xl text-muted-foreground font-medium italic">
            Nenhum livro encontrado no acervo.
          </div>
        ) : (
          filteredBooks?.map((book) => (
            <div key={book.id} className="group bg-card rounded-3xl p-6 border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col h-full relative">
              <button 
                onClick={() => onEdit(book)}
                className="absolute top-4 right-4 p-2 bg-muted/50 text-muted-foreground rounded-xl opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground transition-all z-10"
                title="Editar Livro"
              >
                <Pencil className="w-4 h-4" />
              </button>

              <div className="flex gap-4 mb-4">
                <div className="w-20 h-28 bg-muted rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-border group-hover:scale-105 transition-transform">
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <BookIcon className="w-8 h-8 text-muted-foreground/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-foreground leading-tight line-clamp-2 group-hover:text-primary transition-colors pr-6">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-medium mt-1 truncate">{book.author}</p>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {book.book_category_junction?.map((junction, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-1 rounded-lg bg-primary/5 text-primary text-[10px] font-black uppercase tracking-tight">
                        <Tag className="w-3 h-3 mr-1" />
                        {junction.book_categories.name}
                      </span>
                    ))}
                    {(!book.book_category_junction || book.book_category_junction.length === 0) && (
                      <span className="inline-flex items-center px-2 py-1 rounded-lg bg-muted text-muted-foreground text-[10px] font-black uppercase tracking-tight">
                        <Tag className="w-3 h-3 mr-1" />
                        Sem Categoria
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-xs font-semibold text-muted-foreground">
                  <MapPin className="w-3 h-3 mr-2 text-primary/50" />
                  Local: {book.location || 'Não especificado'}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground">Disponíveis:</span>
                  <span className={`text-sm font-black ${book.available_quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {book.available_quantity} / {book.total_quantity}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${book.available_quantity > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${(book.available_quantity / book.total_quantity) * 100}%` }}
                  ></div>
                </div>
              </div>

              <button
                disabled={book.available_quantity === 0}
                onClick={() => onLoan(book.id)}
                className="mt-auto w-full flex items-center justify-center bg-muted text-foreground py-3 rounded-xl font-bold hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <HandHelping className="w-4 h-4 mr-2" />
                {book.available_quantity > 0 ? 'Emprestar' : 'Indisponível'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
