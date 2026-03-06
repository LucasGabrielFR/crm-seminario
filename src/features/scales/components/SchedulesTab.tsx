
import React, { useState } from 'react';
import { useScaleSchedules, useDeleteScaleSchedule } from '../useScales';
import { Plus, Search, Calendar, Trash2, ArrowRight, Loader2, CalendarRange } from 'lucide-react';
import { ScheduleCreateModal } from './ScheduleCreateModal';
import { ScheduleDetails } from './ScheduleDetails';
import { ScaleSchedule } from '../types';

export const SchedulesTab: React.FC = () => {
  const { data: schedules, isLoading } = useScaleSchedules();
  const deleteSchedule = useDeleteScaleSchedule();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedScale, setSelectedScale] = useState<ScaleSchedule | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSchedules = schedules?.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (selectedScale) {
    return <ScheduleDetails schedule={selectedScale} onBack={() => setSelectedScale(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Buscar escala..."
            className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all w-full md:w-auto"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Escala
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <div className="col-span-full py-20 flex flex-col items-center gap-3 text-muted-foreground italic">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            Carregando escalas...
          </div>
        ) : filteredSchedules?.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground italic flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center">
                 <CalendarRange className="w-10 h-10 text-muted-foreground/30" />
            </div>
            Nenhuma escala encontrada.
          </div>
        ) : (
          filteredSchedules?.map((schedule) => (
            <div 
                key={schedule.id} 
                onClick={() => setSelectedScale(schedule)}
                className="group relative bg-card border border-border rounded-[2.5rem] p-8 hover:border-primary/50 transition-all duration-500 cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/5"
            >
              <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Excluir escala ${schedule.name}?`)) deleteSchedule.mutate(schedule.id);
                    }}
                    className="p-3 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
              </div>

              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6">
                <Calendar className="w-6 h-6" />
              </div>
              
              <h3 className="text-2xl font-black tracking-tight mb-3 pr-8">
                {schedule.name}
              </h3>
              
              <div className="flex flex-wrap gap-4 text-xs font-bold text-muted-foreground">
                <div className="px-3 py-1.5 bg-muted rounded-full">
                    {schedule.weeks.length} Semanas
                </div>
                <div className="px-3 py-1.5 bg-muted rounded-full">
                    Criado em {new Date(schedule.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                Ver Detalhes
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))
        )}
      </div>

      {isCreateModalOpen && <ScheduleCreateModal onClose={() => setIsCreateModalOpen(false)} />}
    </div>
  );
};
