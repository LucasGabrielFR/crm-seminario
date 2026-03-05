import React, { useState } from 'react';
import { BookOpen, History, Plus, Library as LibraryIcon, Cloud, MessageSquare } from 'lucide-react';
import { AddBookModal } from './AddBookModal';
import { EditBookModal } from './EditBookModal';
import { LoanBookModal } from './LoanBookModal';
import { RequestLoanModal } from './RequestLoanModal';
import { BooksList } from './BooksList';
import { LoansList } from './LoansList';
import { VirtualLibrary } from './VirtualLibrary';
import { RequestList } from './RequestList';
import { Book } from './useLibrary';
import { useAuth } from '../../hooks/useAuth';

export const LibraryPage: React.FC = () => {
  const { profile } = useAuth();
  const isLibrarian = profile?.is_librarian || profile?.role === 'admin';

  const [activeTab, setActiveTab] = useState<'books' | 'loans' | 'virtual' | 'requests'>('books');
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const openLoanModal = (bookId: string) => {
    setSelectedBookId(bookId);
    if (isLibrarian) {
      setIsLoanModalOpen(true);
    } else {
      setIsRequestModalOpen(true);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <LibraryIcon className="w-8 h-8 text-primary" />
            Biblioteca Essencial
          </h1>
          <p className="text-muted-foreground font-medium mt-1">
            {isLibrarian ? 'Gerencie o acervo e controle os empréstimos.' : 'Consulte o acervo e solicite empréstimos.'}
          </p>
        </div>
        {isLibrarian && (
          <div className="flex gap-3">
            <button 
              onClick={() => setIsAddBookModalOpen(true)}
              className="flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Livro
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex bg-muted/30 p-1 rounded-2xl w-fit border border-border">
        <button
          onClick={() => setActiveTab('books')}
          className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'books' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Acervo
        </button>
        <button
          onClick={() => setActiveTab('loans')}
          className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'loans' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <History className="w-4 h-4 mr-2" />
          {isLibrarian ? 'Todos Empréstimos' : 'Meus Empréstimos'}
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'requests' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Solicitações
        </button>
        {isLibrarian && (
          <button
            onClick={() => setActiveTab('virtual')}
            className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'virtual' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Cloud className="w-4 h-4 mr-2" />
            Virtual
          </button>
        )}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'books' && (
          <BooksList 
            onLoan={openLoanModal} 
            onEdit={isLibrarian ? (book: Book) => setEditingBook(book) : undefined} 
            isLibrarian={isLibrarian}
          />
        )}
        {activeTab === 'loans' && <LoansList onlySelf={!isLibrarian} />}
        {activeTab === 'requests' && <RequestList onlySelf={!isLibrarian} />}
        {activeTab === 'virtual' && isLibrarian && <VirtualLibrary />}
      </div>

      <AddBookModal isOpen={isAddBookModalOpen} onClose={() => setIsAddBookModalOpen(false)} />
      <EditBookModal 
        isOpen={!!editingBook} 
        onClose={() => setEditingBook(null)} 
        book={editingBook} 
      />
      <LoanBookModal 
        isOpen={isLoanModalOpen} 
        onClose={() => setIsLoanModalOpen(false)} 
        bookId={selectedBookId} 
      />
      <RequestLoanModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        bookId={selectedBookId}
      />
    </div>
  );
};
