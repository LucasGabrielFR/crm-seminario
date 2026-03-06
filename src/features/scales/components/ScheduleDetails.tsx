
import React from 'react';
import { ScaleSchedule, ScaleWeek, ScaleDay, ScaleAssignment, ScalePerson, ScaleRole } from '../types';
import { useScalePeople, useScaleRoles, useUpdateScaleAssignment } from '../useScales';
import { ArrowLeft, Printer, User, Award, CheckCircle2, AlertTriangle } from 'lucide-react';

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

  // Collision detection functions
  const hasDayCollision = (weekIdx: number, dayIdx: number, personId: string) => {
    const day = schedule.weeks[weekIdx].days[dayIdx];
    return day.assignments.filter(a => a.personId === personId).length > 1;
  };

  const hasWeekRoleCollision = (weekIdx: number, roleId: string, personId: string) => {
    const week = schedule.weeks[weekIdx];
    let occurrences = 0;
    week.days.forEach(d => {
      occurrences += d.assignments.filter(a => a.roleId === roleId && a.personId === personId).length;
    });
    return occurrences > 1;
  };

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

      {/* Print-only Header */}
      <div className="hidden print:flex flex-col items-center mb-4 border-b border-zinc-200 pb-2">
        <h1 className="text-xl font-black uppercase tracking-widest text-zinc-900 leading-none">{schedule.name}</h1>
        <p className="text-[10px] font-bold text-zinc-400 uppercase mt-1">Gerado em {new Date().toLocaleDateString('pt-BR')}</p>
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
      <div className="space-y-12 print:space-y-4">
        {schedule.weeks.map((week: ScaleWeek, wIdx: number) => (
          <div key={wIdx} className="space-y-4 print:space-y-1 print:break-inside-avoid">
            <h3 className="text-xl font-black flex items-center gap-3 px-4 border-l-4 border-primary bg-primary/5 py-2 rounded-r-xl w-fit print:border-l-2 print:border-zinc-800 print:bg-transparent print:text-zinc-900 print:text-sm print:py-0 print:px-2 print:mb-1">
              Semana {week.weekIndex}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-5 print:gap-1.5">
              {week.days.map((day: ScaleDay, dIdx: number) => (
                <div key={dIdx} className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm print:shadow-none print:border-zinc-200 print:rounded-md">
                  <div className="bg-muted/50 p-4 border-b border-border font-black text-center print:bg-zinc-50 print:border-zinc-200 print:py-0.5 print:text-[9px] print:uppercase">
                    {day.dayLabel}
                  </div>
                  <div className="p-4 space-y-3 print:p-1.5 print:space-y-1">
                    {day.assignments.map((assignment: ScaleAssignment, aIdx: number) => {
                      const isDayCollision = hasDayCollision(wIdx, dIdx, assignment.personId);
                      const isWeekRoleCollision = hasWeekRoleCollision(wIdx, assignment.roleId, assignment.personId);
                      const hasAnyCollision = isDayCollision || isWeekRoleCollision;

                      return (
                        <div key={aIdx} className={`relative flex flex-col gap-1 p-3 bg-muted/20 border transition-all print:bg-white print:border-transparent print:p-0 rounded-xl print:rounded-none ${
                          hasAnyCollision ? 'border-orange-500/50 bg-orange-500/5 print:bg-transparent' : 'border-transparent hover:border-primary/20'
                        }`}>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground print:text-zinc-400 print:text-[7px]">
                              {getRoleName(assignment.roleId)}
                            </span>
                            {hasAnyCollision && (
                              <div className="flex gap-1 print:hidden" title={isDayCollision ? "Repetição no mesmo dia" : "Repetição na mesma função na semana"}>
                                <AlertTriangle className="w-3.5 h-3.5 text-orange-500" />
                              </div>
                            )}
                          </div>
                          
                          <select 
                            className="bg-transparent text-foreground font-bold text-sm outline-none cursor-pointer disabled:cursor-default w-full print:text-[11px] print:font-black print:appearance-none print:p-0"
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
                              <option key={p.id} value={p.id} className="text-foreground bg-card">
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                    {day.assignments.length === 0 && (
                      <div className="text-center py-4 text-xs italic text-muted-foreground print:py-1 print:text-[9px]">
                        -
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
      <div className="hidden print:block text-center text-[10px] text-zinc-400 pt-8 border-t border-zinc-100 mt-8 font-medium">
          Vocare CRM - Gerador de Escalas Inteligente
      </div>
    </div>
  );
};
