
import React, { useState } from 'react';
import { useScalePeople, useUpsertScalePerson, useDeleteScalePerson } from '../useScales';
import { UserPlus, Search, Pencil, Trash2, Loader2, Phone } from 'lucide-react';

export const PeopleTab: React.FC = () => {
  const { data: people, isLoading } = useScalePeople();
  const upsertPerson = useUpsertScalePerson();
  const deletePerson = useDeleteScalePerson();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<{id?: string, name: string, whatsapp: string} | null>(null);

  const filteredPeople = people?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPerson) return;
    
    await upsertPerson.mutateAsync(editingPerson);
    setIsModalOpen(false);
    setEditingPerson(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Buscar por nome..."
            className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => {
            setEditingPerson({ name: '', whatsapp: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Nova Pessoa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-3 text-muted-foreground italic">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            Carregando pessoas...
          </div>
        ) : filteredPeople?.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground italic">
            Nenhuma pessoa encontrada.
          </div>
        ) : (
          filteredPeople?.map((person) => (
            <div key={person.id} className="group bg-card border border-border rounded-[2.5rem] p-6 hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5">
              <div className="flex justify-between items-start mb-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center font-black text-primary text-xl shadow-inner">
                  {person.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => {
                      setEditingPerson(person);
                      setIsModalOpen(true);
                    }}
                    className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm(`Excluir ${person.name}?`)) {
                        deletePerson.mutate(person.id);
                      }
                    }}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-black tracking-tight mb-2 truncate" title={person.name}>
                {person.name}
              </h3>
              
              {person.whatsapp && (
                <div className="flex items-center text-muted-foreground text-sm font-bold gap-2 bg-muted/30 w-fit px-3 py-1.5 rounded-full">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  {person.whatsapp}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-md border border-border rounded-[2.5rem] p-8 shadow-2xl">
            <h2 className="text-2xl font-black mb-6">
              {editingPerson?.id ? 'Editar Pessoa' : 'Nova Pessoa'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nome Completo</label>
                <input 
                  required
                  autoFocus
                  className="w-full px-5 py-4 bg-muted/50 border border-border rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                  value={editingPerson?.name}
                  onChange={e => setEditingPerson(prev => ({ ...prev!, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">WhatsApp</label>
                <input 
                  className="w-full px-5 py-4 bg-muted/50 border border-border rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                  placeholder="(00) 00000-0000"
                  value={editingPerson?.whatsapp}
                  onChange={e => setEditingPerson(prev => ({ ...prev!, whatsapp: e.target.value }))}
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
                  disabled={upsertPerson.isPending}
                  className="flex-1 py-4 bg-primary text-primary-foreground text-sm font-black uppercase tracking-wider rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {upsertPerson.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
