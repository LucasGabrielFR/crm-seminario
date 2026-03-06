
import React, { useState } from 'react';
import { useScalePeople, useScaleRoles, useCreateScaleSchedule } from '../useScales';
import { X, Check, Loader2, Sparkles } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

export const ScheduleCreateModal: React.FC<Props> = ({ onClose }) => {
  const { data: people } = useScalePeople();
  const { data: roles } = useScaleRoles();
  const createScale = useCreateScaleSchedule();

  const [name, setName] = useState('');
  const [duration, setDuration] = useState(4);
  const [selectedDays, setSelectedDays] = useState<number[]>([0]); // Default Sunday
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const handleToggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleTogglePerson = (id: string) => {
    setSelectedPeople(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleToggleRole = (id: string) => {
    setSelectedRoles(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleSelectAllPeople = () => {
    if (selectedPeople.length === people?.length) setSelectedPeople([]);
    else setSelectedPeople(people?.map(p => p.id) || []);
  };

  const handleSelectAllRoles = () => {
    if (selectedRoles.length === roles?.length) setSelectedRoles([]);
    else setSelectedRoles(roles?.map(r => r.id) || []);
  };

  const handleCreate = async () => {
    if (!name.trim()) return alert("Dê um nome para a escala");
    if (selectedDays.length === 0) return alert("Selecione pelo menos um dia");
    if (selectedPeople.length === 0) return alert("Selecione pelo menos uma pessoa");
    if (selectedRoles.length === 0) return alert("Selecione pelo menos uma função");

    try {
      await createScale.mutateAsync({
        name,
        settings: {
          durationWeeks: duration,
          daysOfWeek: selectedDays,
          personIds: selectedPeople,
          roleIds: selectedRoles
        }
      });
      onClose();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-card w-full max-w-4xl max-h-[90vh] overflow-hidden border border-border rounded-[3rem] shadow-2xl flex flex-col">
        <div className="p-8 border-b border-border flex justify-between items-center bg-muted/30">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
                <Sparkles className="w-6 h-6" />
             </div>
             <div>
                <h2 className="text-2xl font-black">Gerador de Escala Inteligente</h2>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-0.5">Configure os parâmetros da sua nova escala</p>
             </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-muted rounded-2xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          {/* Base Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nome da Escala</label>
              <input 
                placeholder="Ex: Escala Mensal de Março"
                className="w-full px-5 py-4 bg-muted/50 border border-border rounded-2xl text-lg font-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground/30"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Duração (Semanas)</label>
              <input 
                type="number"
                min="1"
                max="52"
                className="w-full px-5 py-4 bg-muted/50 border border-border rounded-2xl text-lg font-black focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground/30"
                value={duration}
                onChange={e => setDuration(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          {/* Days */}
          <div className="space-y-4">
             <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Dias da Semana</label>
             <div className="flex flex-wrap gap-3">
                {WEEKDAYS.map((day, idx) => (
                  <button
                    key={day}
                    onClick={() => handleToggleDay(idx)}
                    className={`px-6 py-4 rounded-2xl font-black text-sm transition-all ${
                      selectedDays.includes(idx)
                        ? 'bg-primary/20 text-primary border-2 border-primary shadow-inner'
                        : 'bg-muted/30 border-2 border-transparent text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    {day}
                  </button>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Roles Selection */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Funções p/ Escala</label>
                <button onClick={handleSelectAllRoles} className="text-[10px] font-black uppercase tracking-tighter text-primary hover:underline">
                    {selectedRoles.length === roles?.length ? 'Desmarcar Tudo' : 'Selecionar Tudo'}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {roles?.map(role => (
                   <button
                    key={role.id}
                    onClick={() => handleToggleRole(role.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl text-left border transition-all ${
                      selectedRoles.includes(role.id)
                        ? 'bg-primary/5 border-primary/30 text-foreground ring-1 ring-primary/20'
                        : 'bg-muted/20 border-border text-muted-foreground hover:border-muted-foreground/30'
                    }`}
                   >
                     <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                       selectedRoles.includes(role.id) ? 'bg-primary text-primary-foreground' : 'border-2 border-border'
                     }`}>
                        {selectedRoles.includes(role.id) && <Check className="w-3.5 h-3.5" />}
                     </div>
                     <span className="font-bold text-sm tracking-tight">{role.name}</span>
                   </button>
                ))}
              </div>
            </div>

            {/* People Selection */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Membros Disponíveis</label>
                <button onClick={handleSelectAllPeople} className="text-[10px] font-black uppercase tracking-tighter text-primary hover:underline">
                    {selectedPeople.length === people?.length ? 'Desmarcar Tudo' : 'Selecionar Tudo'}
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {people?.map(person => (
                   <button
                    key={person.id}
                    onClick={() => handleTogglePerson(person.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-2xl text-left border transition-all ${
                      selectedPeople.includes(person.id)
                        ? 'bg-primary/5 border-primary/30 text-foreground ring-1 ring-primary/20'
                        : 'bg-muted/20 border-border text-muted-foreground hover:border-muted-foreground/30'
                    }`}
                   >
                     <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                       selectedPeople.includes(person.id) ? 'bg-primary text-primary-foreground' : 'border-2 border-border'
                     }`}>
                        {selectedPeople.includes(person.id) && <Check className="w-3.5 h-3.5" />}
                     </div>
                     <span className="font-bold text-sm tracking-tight">{person.name}</span>
                   </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-border bg-muted/10">
          <button
            onClick={handleCreate}
            disabled={createScale.isPending}
            className="w-full bg-primary text-primary-foreground py-5 rounded-[2rem] font-black text-lg uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {createScale.isPending ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Gerando Algoritmo...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Gerar Escala Automaticamente
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
