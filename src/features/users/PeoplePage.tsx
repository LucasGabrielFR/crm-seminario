import React, { useState } from 'react';
import { useUsers } from './useUsers';
import { Search, Filter, Pencil, Trash2, Loader2, Library as LibraryIcon, UserPlus } from 'lucide-react';
import { AddUserModal } from './AddUserModal';
import { EditUserModal } from './EditUserModal';
import { supabase } from '../../lib/supabase';
import { Profile } from './useUsers';
import { useAuth } from '../../hooks/useAuth';

export const PeoplePage: React.FC = () => {
  const { profile: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const { data: profiles, isLoading, refetch } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Profile | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredProfiles = profiles?.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (userId: string, name: string) => {
    if (!confirm(`Tem certeza que deseja remover ${name}? Esta ação não pode ser desfeita.`)) {
      return;
    }

    setDeletingId(userId);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Sessão expirada.');

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-create-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify({ action: 'delete', userId }),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Erro ao deletar usuário');
      }

      refetch();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Gestão de Pessoas</h1>
          <p className="text-muted-foreground font-medium mt-1">Gerencie os perfis de seminaristas, formadores e professores.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Novo Membro
        </button>
      </div>

      <AddUserModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => refetch()} 
      />

      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSuccess={() => refetch()}
      />

      <div className="bg-card rounded-3xl shadow-2xl shadow-primary/5 border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 bg-muted/30">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Buscar por nome, cargo ou e-mail..."
              className="w-full pl-12 pr-4 py-3 bg-background border border-border rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all px-4"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center px-6 py-3 text-sm font-bold text-foreground bg-background border border-border rounded-2xl hover:bg-muted transition-all">
            <Filter className="w-4 h-4 mr-2 text-primary" />
            Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-black tracking-[0.2em]">
                <th className="px-8 py-5">Membro</th>
                <th className="px-8 py-5">E-mail</th>
                <th className="px-8 py-5">Cargo</th>
                <th className="px-8 py-5">Etapa Formativa</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground font-medium italic">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                      Carregando membros...
                    </div>
                  </td>
                </tr>
              ) : filteredProfiles?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-muted-foreground font-medium italic">
                    Nenhum membro encontrado.
                  </td>
                </tr>
              ) : (
                filteredProfiles?.map((profile) => (
                  <tr key={profile.id} className="group hover:bg-muted/40 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black mr-4 shadow-inner">
                          {profile.full_name?.charAt(0)}
                        </div>
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                          {profile.full_name}
                          {profile.is_librarian && (
                            <span className="bg-primary/10 text-primary text-[8px] px-1.5 py-0.5 rounded font-black uppercase flex items-center gap-1">
                              <LibraryIcon className="w-2.5 h-2.5" />
                              Bibliotecário
                            </span>
                          )}
                          {profile.is_teacher && profile.role !== 'professor' && (
                            <span className="bg-orange-500/10 text-orange-600 text-[8px] px-1.5 py-0.5 rounded font-black uppercase flex items-center gap-1">
                              Professor
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm font-medium text-muted-foreground">
                        {profile.email}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        profile.role === 'admin' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                        profile.role === 'formador' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' :
                        profile.role === 'professor' ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400' :
                        'bg-slate-500/10 text-slate-600 dark:text-slate-400'
                      }`}>
                        {profile.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-muted-foreground">
                      {(profile as any).formative_stages?.name || '---'}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {(isAdmin || profile.role !== 'admin') && (
                          <>
                            <button 
                              onClick={() => setEditingUser(profile)}
                              className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all"
                              title="Editar"
                            >
                              <Pencil className="w-5 h-5" />
                            </button>
                            <button 
                              disabled={deletingId === profile.id || profile.id === currentUser?.id}
                              onClick={() => handleDelete(profile.id, profile.full_name)}
                              className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-50"
                              title={profile.id === currentUser?.id ? "Você não pode se excluir" : "Excluir"}
                            >
                              {deletingId === profile.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
