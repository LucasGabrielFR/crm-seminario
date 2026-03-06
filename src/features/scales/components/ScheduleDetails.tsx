
import React from 'react';
import { ScaleSchedule, ScaleWeek, ScaleDay, ScaleAssignment, ScalePerson, ScaleRole } from '../types';
import { useScalePeople, useScaleRoles, useUpdateScaleAssignment } from '../useScales';
import { ArrowLeft, Printer, User, Award, CheckCircle2 } from 'lucide-react';

interface Props {
  schedule: ScaleSchedule;
  onBack: () => void;
}

export const ScheduleDetails: React.FC<Props> = ({ schedule, onBack }) => {
  const { data: people } = useScalePeople();
  const { data: roles } = useScaleRoles();
  const updateAssignment = useUpdateScaleAssignment();

  const handlePrint = () => {
    window.print();
  };

  const getRoleName = (id: string) => roles?.find((r: ScaleRole) => r.id === id)?.name || "-";

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header - Hidden in Print */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center print:hidden">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-muted hover:bg-muted-foreground/10 rounded-2xl transition-all group"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h2 className="text-3xl font-black tracking-tight">{schedule.name}</h2>
            <p className="text-muted-foreground font-bold text-sm tracking-widest uppercase mt-1">
              Escala de {schedule.weeks.length} semanas • {schedule.settings.daysOfWeek.length} dias p/ semana
            </p>
          </div>
        </div>

        <button 
          onClick={handlePrint}
          className="flex items-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-[0.98] transition-all"
        >
          <Printer className="w-5 h-5" />
          Imprimir Escala (PDF)
        </button>
      </div>

      {/* Stats - Hidden in Print */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
          <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] flex items-center gap-4">
               <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <User className="w-6 h-6" />
               </div>
               <div>
                    <div className="text-xs font-black uppercase tracking-widest text-primary/40">Membros Atuando</div>
                    <div className="text-2xl font-black">{schedule.settings.personIds.length}</div>
               </div>
          </div>
          <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] flex items-center gap-4">
               <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <Award className="w-6 h-6" />
               </div>
               <div>
                    <div className="text-xs font-black uppercase tracking-widest text-primary/40">Funções Ativas</div>
                    <div className="text-2xl font-black">{schedule.settings.roleIds.length}</div>
               </div>
          </div>
          <div className="bg-primary/5 border border-primary/10 p-6 rounded-[2rem] flex items-center gap-4">
               <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-6 h-6" />
               </div>
               <div>
                    <div className="text-xs font-black uppercase tracking-widest text-primary/40">Total de Plantões</div>
                    <div className="text-2xl font-black">
                        {schedule.weeks.reduce((acc: number, w: ScaleWeek) => acc + w.days.reduce((dAcc: number, d: ScaleDay) => dAcc + d.assignments.length, 0), 0)}
                    </div>
               </div>
          </div>
      </div>

      {/* Main Grid for Schedule - Printable */}
      <div className="space-y-12 print:space-y-8">
        {schedule.weeks.map((week: ScaleWeek, wIdx: number) => (
          <div key={wIdx} className="space-y-6 print:break-inside-avoid">
            <h3 className="text-xl font-black flex items-center gap-3 px-4 border-l-4 border-primary bg-primary/5 py-2 rounded-r-xl w-fit">
              Semana {week.weekIndex}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {week.days.map((day: ScaleDay, dIdx: number) => (
                <div key={dIdx} className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm print:shadow-none print:border-zinc-300">
                  <div className="bg-muted/50 p-4 border-b border-border font-black text-center print:bg-zinc-100 print:border-zinc-300">
                    {day.dayLabel}
                  </div>
                  <div className="p-4 space-y-3">
                    {day.assignments.map((assignment: ScaleAssignment, aIdx: number) => (
                      <div key={aIdx} className="flex flex-col gap-1 p-3 bg-muted/20 border border-transparent rounded-xl hover:border-primary/20 transition-all print:bg-white print:border-zinc-200">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground print:text-zinc-500">
                          {getRoleName(assignment.roleId)}
                        </span>
                        <select 
                          className="bg-transparent font-bold text-sm outline-none cursor-pointer appearance-none disabled:cursor-default"
                          value={assignment.personId}
                          onChange={(e) => updateAssignment.mutate({
                            schedule,
                            weekIdx: wIdx,
                            dayIdx: dIdx,
                            roleId: assignment.roleId,
                            personId: e.target.value
                          })}
                        >
                          {people?.map((p: ScalePerson) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                    {day.assignments.length === 0 && (
                      <div className="text-center py-4 text-xs italic text-muted-foreground">
                        Nenhuma atribuição
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Print Info */}
      <div className="hidden print:block text-center text-xs text-zinc-400 pt-12">
          Gerado automaticamente por Vocare CRM - Gerador de Escalas em {new Date().toLocaleDateString('pt-BR')}
      </div>
    </div>
  );
};
