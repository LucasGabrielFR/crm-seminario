import React, { useState } from 'react';
import { useUsers } from './useUsers';
import { Search, UserPlus, Filter, MoreVertical } from 'lucide-react';

export const PeoplePage: React.FC = () => {
  const { data: profiles, isLoading } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfiles = profiles?.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Gestão de Pessoas</h1>
          <p className="text-muted-foreground font-medium mt-1">Gerencie os perfis de seminaristas, formadores e professores.</p>
        </div>
        <button className="flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <UserPlus className="w-5 h-5 mr-2" />
          Novo Membro
        </button>
      </div>

      <div className="bg-card rounded-3xl shadow-2xl shadow-primary/5 border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row gap-4 bg-muted/30">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Buscar por nome ou cargo..."
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
                <th className="px-8 py-5">Cargo</th>
                <th className="px-8 py-5">Etapa Formativa</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-muted-foreground font-medium italic">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                      Carregando membros...
                    </div>
                  </td>
                </tr>
              ) : filteredProfiles?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-muted-foreground font-medium italic">
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
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                          {profile.full_name}
                        </span>
                      </div>
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
                      {(profile as any).formative_stages?.name || 'Não atribuída'}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-all hover:text-foreground">
                        <MoreVertical className="w-5 h-5" />
                      </button>
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
