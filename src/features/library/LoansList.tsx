import React from 'react';
import { useBookLoans, useReturnBook } from './useLibrary';
import { Calendar, User, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface LoansListProps {
  onlySelf?: boolean;
}

export const LoansList: React.FC<LoansListProps> = ({ onlySelf }) => {
  const { user, profile } = useAuth();
  const { data: loans, isLoading } = useBookLoans();
  const returnBook = useReturnBook();

  const isLibrarian = profile?.is_librarian || profile?.role === 'admin';

  const filteredLoans = onlySelf 
    ? loans?.filter(l => l.user_id === user?.id)
    : loans;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="font-bold">Carregando empréstimos...</p>
      </div>
    );
  }

  const handleReturn = async (loanId: string) => {
    if (confirm('Confirmar a devolução deste livro?')) {
      try {
        await returnBook.mutateAsync(loanId);
      } catch (err) {
        alert('Erro ao processar devolução');
      }
    }
  };

  return (
    <div className="bg-card rounded-3xl shadow-2xl shadow-primary/5 border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-black tracking-[0.2em]">
              <th className="px-8 py-5">Livro</th>
              <th className="px-8 py-5">Quem Retirou</th>
              <th className="px-8 py-5">Data Retirada</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredLoans?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground font-medium italic">
                  Nenhum registro de empréstimo.
                </td>
              </tr>
            ) : (
              filteredLoans?.map((loan) => (
                <tr key={loan.id} className="group hover:bg-muted/40 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {loan.books?.title}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">{loan.books?.author}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center text-sm font-bold text-foreground">
                      <User className="w-4 h-4 mr-2 text-primary/50" />
                      {loan.profiles?.full_name || loan.guest_name || '---'}
                      {loan.guest_name && (
                        <span className="ml-2 px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-600 text-[8px] uppercase">Convidado</span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center text-xs font-bold text-muted-foreground text-nowrap">
                        <Calendar className="w-3 h-3 mr-2" />
                        {new Date(loan.loan_date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-xs font-medium text-orange-500/70">
                        <Clock className="w-3 h-3 mr-2" />
                        Vence: {new Date(loan.due_date).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                      loan.status === 'returned' ? 'bg-green-500/10 text-green-600' :
                      loan.status === 'overdue' ? 'bg-red-500/10 text-red-600' :
                      'bg-blue-500/10 text-blue-600'
                    }`}>
                      {loan.status === 'returned' ? 'Devolvido' : 
                       loan.status === 'overdue' ? 'Atrasado' : 'Emprestado'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {loan.status !== 'returned' && isLibrarian && (
                      <button 
                        onClick={() => handleReturn(loan.id)}
                        className="flex items-center gap-2 ml-auto px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Devolver
                      </button>
                    )}
                    {loan.status === 'returned' && loan.return_date && (
                      <span className="text-[10px] font-bold text-muted-foreground/50">
                        Em {new Date(loan.return_date).toLocaleDateString()}
                      </span>
                    )}
                    {!isLibrarian && loan.status !== 'returned' && (
                        <span className="text-[10px] font-bold text-blue-600 italic">Em sua posse</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
