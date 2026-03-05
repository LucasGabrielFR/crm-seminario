import React, { useState } from 'react';
import { useBookRequests, useUpdateRequest, useCreateLoan } from './useLibrary';
import { CheckCircle2, XCircle, User, Book as BookIcon, Calendar, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface RequestListProps {
  onlySelf?: boolean;
}

export const RequestList: React.FC<RequestListProps> = ({ onlySelf }) => {
  const { user } = useAuth();
  const { data: requests, isLoading } = useBookRequests();
  const updateRequest = useUpdateRequest();
  const createLoan = useCreateLoan();
  
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [dueDate, setDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  const filteredRequests = onlySelf 
    ? requests?.filter(r => r.user_id === user?.id)
    : requests;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="font-bold">Carregando solicitações...</p>
      </div>
    );
  }

  const handleStatusChange = async (requestId: string, status: 'approved' | 'rejected') => {
    const confirmMsg = status === 'approved' ? 'Aprovar esta solicitação?' : 'Negar esta solicitação?';
    if (!confirm(confirmMsg)) return;

    try {
      await updateRequest.mutateAsync({ id: requestId, status });
    } catch (err) {
      alert('Erro ao atualizar status');
    }
  };

  const handleFinalizeLoan = async () => {
    if (!selectedRequest) return;

    try {
        // 1. Create the loan
        await createLoan.mutateAsync({
            book_id: selectedRequest.book_id,
            user_id: selectedRequest.user_id,
            loan_date: new Date().toISOString(),
            due_date: new Date(dueDate).toISOString(),
            status: 'active'
        });

        // 2. Update request status to fulfilled
        await updateRequest.mutateAsync({ 
          id: selectedRequest.id, 
          status: 'fulfilled' 
        });

        setSelectedRequest(null);
    } catch (err) {
        alert('Erro ao iniciar empréstimo');
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-3xl shadow-2xl shadow-primary/5 border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="px-8 py-5">Livro</th>
                <th className="px-8 py-5">Solicitante</th>
                <th className="px-8 py-5">Data Solicitação</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRequests?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground font-medium italic">
                    Nenhuma solicitação encontrada.
                  </td>
                </tr>
              ) : (
                filteredRequests?.map((request) => (
                  <tr key={request.id} className="group hover:bg-muted/40 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {request.books?.title}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium">{request.books?.author}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center text-sm font-bold text-foreground">
                        <User className="w-4 h-4 mr-2 text-primary/50" />
                        {request.profiles?.full_name}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center text-xs font-bold text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-2" />
                        {new Date(request.request_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        request.status === 'approved' ? 'bg-green-500/10 text-green-600' :
                        request.status === 'rejected' ? 'bg-red-500/10 text-red-600' :
                        request.status === 'fulfilled' ? 'bg-blue-500/10 text-blue-600' :
                        'bg-orange-500/10 text-orange-600'
                      }`}>
                        {request.status === 'approved' ? 'Aguardando Retirada' : 
                         request.status === 'rejected' ? 'Negado' : 
                         request.status === 'fulfilled' ? 'Emprestado' : 'Aguardando'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {!onlySelf && request.status === 'pending' && (
                        <div className="flex justify-end gap-2">
                          <button 
                            disabled={updateRequest.isPending}
                            onClick={() => handleStatusChange(request.id, 'approved')}
                            className="p-2 text-green-500 hover:bg-green-500/10 rounded-xl transition-all disabled:opacity-50"
                            title="Aceitar"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                          <button 
                            disabled={updateRequest.isPending}
                            onClick={() => handleStatusChange(request.id, 'rejected')}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-50"
                            title="Negar"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                      
                      {!onlySelf && request.status === 'approved' && (
                          <button 
                            onClick={() => setSelectedRequest(request)}
                            className="flex items-center gap-2 ml-auto px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            <BookIcon className="w-4 h-4" />
                            Confirmar Retirada
                          </button>
                      )}

                      {onlySelf && request.status === 'pending' && (
                          <span className="text-[10px] font-bold text-muted-foreground italic">Aguardando Avaliação</span>
                      )}

                      {onlySelf && request.status === 'approved' && (
                          <span className="text-[10px] font-bold text-green-600 italic">Pode retirar no balcão!</span>
                      )}

                      {request.status === 'fulfilled' && (
                          <span className="text-[10px] font-bold text-blue-600 italic">Livro em posse do usuário</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Confirmação de Retirada */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-black text-foreground">Confirmar Empréstimo</h2>
                <p className="text-muted-foreground font-medium mt-1">Defina a data de devolução para este livro.</p>
              </div>
              <button 
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-muted rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-muted/50 rounded-2xl space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <BookIcon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-foreground line-clamp-1">{selectedRequest.books?.title}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-muted-foreground uppercase text-xs tracking-wider">{selectedRequest.profiles?.full_name}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Data de Devolução</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <input 
                    type="date" 
                    className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none font-bold"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  disabled={createLoan.isPending || updateRequest.isPending}
                  onClick={handleFinalizeLoan}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-black shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {(createLoan.isPending || updateRequest.isPending) ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      FINALIZAR RETIRADA
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="w-full py-4 rounded-2xl font-bold text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
