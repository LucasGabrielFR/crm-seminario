import React, { useMemo } from 'react';
import { useClasses, Schedule } from '../useAcademic';
import { useAuth } from '../../../hooks/useAuth';
import { Clock, Printer, MapPin, AlertTriangle, Loader2 } from 'lucide-react';

interface FormattedSchedule extends Schedule {
  className: string;
  semester: string;
  teacherId: string;
  teacherName: string;
}

const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export const TimetableTab: React.FC = () => {
  const { profile } = useAuth();
  const { data: classes, isLoading } = useClasses();

  // Role booleans
  const isAdminOrFormador = profile?.role === 'admin' || profile?.role === 'formador';
  const isProfessor = profile?.role === 'professor' || profile?.is_teacher;
  const isStudent = profile?.role === 'seminarista';

  const timetableData = useMemo(() => {
    if (!classes) return [];

    let filteredClasses = classes;

    // Filter relevant classes based on user role
    // Admin sees everything
    // If not Admin, evaluate if they are Teacher or Student
    if (!isAdminOrFormador) {
      filteredClasses = classes.filter(cls => {
        const isMyClassAsTeacher = isProfessor && cls.teacher_id === profile?.id;
        const isMyClassAsStudent = isStudent && cls.enrollments?.some(e => e.student_id === profile?.id);
        return isMyClassAsTeacher || isMyClassAsStudent;
      });
    }

    // Unroll schedules into a flat array
    let schedules: FormattedSchedule[] = [];
    filteredClasses.forEach(cls => {
      if (cls.class_schedules && cls.class_schedules.length > 0) {
        cls.class_schedules.forEach(sch => {
          schedules.push({
            ...sch,
            className: cls.subjects?.name || 'Desconhecida',
            semester: cls.semester,
            teacherId: cls.teacher_id,
            teacherName: cls.profiles?.full_name || 'Não atribuído'
          });
        });
      }
    });

    // Detect clashes (only really matters if viewing multiple classes, e.g. Admin view)
    // A clash is: same teacher, same day, overlapping times.
    const clashingIds = new Set<string>();
    
    // Sort broadly to make overlap detection easier
    schedules.sort((a, b) => a.start_time.localeCompare(b.start_time));
    
    if (isAdminOrFormador) {
      for (let i = 0; i < schedules.length; i++) {
        for (let j = i + 1; j < schedules.length; j++) {
          const a = schedules[i];
          const b = schedules[j];
          if (
            a.teacherId === b.teacherId && 
            a.semester === b.semester &&
            a.day_of_week === b.day_of_week && 
            a.start_time < b.end_time && 
            a.end_time > b.start_time
          ) {
            clashingIds.add(a.id);
            clashingIds.add(b.id);
          }
        }
      }
    }

    // Group by Day (0 to 6)
    const grouped: Record<number, { schedule: FormattedSchedule, isClashing: boolean }[]> = {
      0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
    };

    schedules.forEach(sch => {
      grouped[sch.day_of_week].push({
        schedule: sch,
        isClashing: clashingIds.has(sch.id)
      });
    });

    // Sort within days by start time
    Object.keys(grouped).forEach(key => {
      const day = parseInt(key);
      grouped[day].sort((a, b) => a.schedule.start_time.localeCompare(b.schedule.start_time));
    });

    return grouped;
  }, [classes, isAdminOrFormador, isProfessor, isStudent, profile?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Carregando grade de horários...
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  // Only show days that have actual classes to avoid empty columns
  const activeDays = Object.keys(timetableData)
    .map(Number)
    .filter(day => timetableData[day].length > 0)
    .sort();

  return (
    <div className="p-6 animate-in fade-in duration-500 print:p-0">
      {/* Non-printable header */}
      <div className="print:hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Grade de Horários</h2>
          <p className="text-muted-foreground mt-1">
            {isAdminOrFormador 
              ? "Visão geral de todas as turmas e horários. Conflitos de professores serão destacados." 
              : "Visualize os horários das suas aulas semanais."}
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
        >
          <Printer className="w-4 h-4 mr-2" />
          Imprimir / PDF
        </button>
      </div>

      {/* Printable Area Header (Only visible in print mode) */}
      <div className="hidden print:block mb-8 mt-4 text-center">
        <h1 className="text-3xl font-black">Vocare CRM - Grade de Horários</h1>
        <p className="text-lg text-muted-foreground mt-2">
           Visualização oficial de todos os turnos e disciplinas
        </p>
      </div>

      {activeDays.length === 0 ? (
         <div className="bg-card p-12 rounded-3xl border border-border text-center shadow-sm print:hidden">
         <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
           <Clock className="w-8 h-8 text-muted-foreground" />
         </div>
         <h3 className="text-lg font-bold">Nenhum horário encontrado</h3>
         <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
           Não há turmas com horários definidos para exibir na sua grade atual.
         </p>
       </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 print:grid-cols-3 print:gap-4">
          {activeDays.map(day => (
            <div key={day} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col print:break-inside-avoid print:shadow-none print:border-2">
              <div className="bg-primary/5 border-b border-border py-3 px-4 text-center">
                <h3 className="font-black text-lg text-foreground uppercase tracking-wider">{DAYS[day]}</h3>
              </div>
              
              <div className="p-4 flex-1 flex flex-col gap-4">
                {timetableData[day].map(({ schedule, isClashing }) => (
                  <div 
                    key={schedule.id} 
                    className={`p-4 rounded-xl border ${
                      isClashing 
                        ? 'bg-red-500/10 border-red-500/30 text-red-900 dark:text-red-200 print:text-red-900' 
                        : 'bg-background border-border shadow-sm'
                    }`}
                  >
                    {isClashing && (
                      <div className="flex items-center text-[10px] uppercase font-black tracking-widest text-red-500 mb-2">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Choque de Horário
                      </div>
                    )}
                    
                    <h4 className="font-bold whitespace-normal leading-tight">
                      {schedule.className}
                    </h4>
                    
                    <div className="flex justify-between items-center mt-3 text-xs font-semibold">
                      <span className="flex items-center text-muted-foreground">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)}
                      </span>
                      <span className="bg-primary/10 text-primary px-2 py-0.5 rounded tracking-wider uppercase font-black text-[9px]">
                        {schedule.semester}
                      </span>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground flex flex-col gap-1.5">
                      <span className="flex items-center">
                        <span className="font-bold text-foreground mr-1">Prof:</span> {schedule.teacherName}
                      </span>
                      {schedule.room && (
                        <span className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-foreground" /> {schedule.room}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
