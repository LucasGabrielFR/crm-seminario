
import React, { useState } from 'react';
import { useScaleRoles, useUpsertScaleRole, useDeleteScaleRole } from '../useScales';
import { Plus, Search, Pencil, Trash2, Loader2, Award } from 'lucide-react';

export const RolesTab: React.FC = () => {
  const { data: roles, isLoading } = useScaleRoles();
  const upsertRole = useUpsertScaleRole();
  const deleteRole = useDeleteScaleRole();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<{id?: string, name: string} | null>(null);

  const filteredRoles = roles?.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;
    
    await upsertRole.mutateAsync(editingRole);
    setIsModalOpen(false);
    setEditingRole(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Buscar por função..."
            className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => {
            setEditingRole({ name: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Função
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-3 text-muted-foreground italic">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            Carregando funções...
          </div>
        ) : filteredRoles?.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground italic">
            Nenhuma função encontrada.
          </div>
        ) : (
          filteredRoles?.map((role) => (
            <div key={role.id} className="group bg-card border border-border rounded-[2.5rem] p-6 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5">
              <div className="flex justify-between items-start mb-2">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shadow-inner">
                  <Award className="w-5 h-5" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setEditingRole(role);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm(`Excluir a função ${role.name}?`)) {
                        deleteRole.mutate(role.id);
                      }
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-black tracking-tight truncate" title={role.name}>
                {role.name}
              </h3>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-md border border-border rounded-[2.5rem] p-8 shadow-2xl">
            <h2 className="text-2xl font-black mb-6">
              {editingRole?.id ? 'Editar Função' : 'Nova Função'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nome da Função</label>
                <input 
                  required
                  autoFocus
                  placeholder="Ex: Cerimoniário, Leitor..."
                  className="w-full px-5 py-4 bg-muted/50 border border-border rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                  value={editingRole?.name}
                  onChange={e => setEditingRole(prev => ({ ...prev!, name: e.target.value }))}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 text-sm font-black uppercase tracking-wider text-muted-foreground hover:bg-muted rounded-2xl transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={upsertRole.isPending}
                  className="flex-1 py-4 bg-primary text-primary-foreground text-sm font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {upsertRole.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
