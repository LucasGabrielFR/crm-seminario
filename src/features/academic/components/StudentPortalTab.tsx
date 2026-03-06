import { useClasses, useAcademicSettings } from '../useAcademic';
import { useAuth } from '../../../hooks/useAuth';
import { GraduationCap, Clock, CalendarDays, MapPin, User, Loader2 } from 'lucide-react';

export const StudentPortalTab: React.FC = () => {
  const { profile } = useAuth();
  const { data: classes, isLoading: isLoadingClasses } = useClasses();
  const { data: settings, isLoading: isLoadingSettings } = useAcademicSettings();

  const isLoading = isLoadingClasses || isLoadingSettings;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Carregando boletim...
      </div>
    );
  }

  // Pick classes where the student is enrolled in
  const studentClasses = classes?.filter(cls => 
    cls.enrollments?.some(e => e.student_id === profile?.id)
  ) || [];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="p-6 bg-muted/10 min-h-full">
        {studentClasses.length === 0 ? (
          <div className="bg-background p-12 rounded-3xl border border-border text-center shadow-sm">
            <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold">Nenhuma matrícula encontrada</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Você ainda não está matriculado em nenhuma disciplina neste semestre.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentClasses.map((cls) => {
              const myEnrollment = cls.enrollments?.find(e => e.student_id === profile?.id);
              
              // Calculate media
              let mediaStr = '-';
              let numMedia = 0;
              let isApproved = false;
              if (myEnrollment?.n1_grade != null && myEnrollment?.n2_grade != null) {
                const w1 = settings?.n1_weight ?? 5;
                const w2 = settings?.n2_weight ?? 5;
                numMedia = ((myEnrollment.n1_grade * w1) + (myEnrollment.n2_grade * w2)) / 10;
                mediaStr = numMedia.toFixed(1);
                isApproved = numMedia >= (settings?.passing_grade ?? 7);
              }

              return (
                <div key={cls.id} className="bg-background rounded-2xl border border-border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col text-left">
                  {/* Header */}
                  <div className="p-5 border-b border-border bg-muted/20">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-xl font-bold leading-tight line-clamp-2">{cls.subjects?.name}</h3>
                       <span className="bg-primary/10 text-primary text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-wider shadow-sm shrink-0 ml-2">
                         {cls.semester}
                       </span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-muted-foreground mt-3">
                      <User className="w-4 h-4 mr-1.5" />
                      Prof. {cls.profiles?.full_name || 'Não atribuído'}
                    </div>
                  </div>

                  {/* Body: Grades */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Seu Desempenho</h4>
                    
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="bg-muted/30 p-3 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Nota 1</span>
                        <span className="text-lg font-black text-foreground">{myEnrollment?.n1_grade != null ? myEnrollment.n1_grade : '-'}</span>
                      </div>
                      <div className="bg-muted/30 p-3 rounded-xl flex flex-col items-center justify-center">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Nota 2</span>
                        <span className="text-lg font-black text-foreground">{myEnrollment?.n2_grade != null ? myEnrollment.n2_grade : '-'}</span>
                      </div>
                      <div className={`p-3 rounded-xl flex flex-col items-center justify-center ${mediaStr !== '-' ? (isApproved ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500') : 'bg-muted/30'}`}>
                        <span className={`text-[10px] uppercase font-bold mb-1 ${mediaStr !== '-' ? (isApproved ? 'text-green-600/80' : 'text-red-500/80') : 'text-muted-foreground'}`}>Média</span>
                        <span className="text-lg font-black">{mediaStr}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-muted/30 px-5 py-4 rounded-xl">
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Faltas Computadas</span>
                      <span className="font-black text-xl text-foreground">{myEnrollment?.absences || 0}</span>
                    </div>

                    {/* Footer: Schedules */}
                    {cls.class_schedules && cls.class_schedules.length > 0 && (
                      <div className="mt-6 pt-5 border-t border-border">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center">
                           <CalendarDays className="w-3 h-3 mr-1" />
                           Horários da Turma
                        </h4>
                        <div className="space-y-3">
                          {cls.class_schedules.map(sch => {
                            const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
                            return (
                              <div key={sch.id} className="flex flex-col text-sm border-l-2 border-primary/30 pl-3 py-1">
                                <span className="font-bold flex items-center text-foreground">
                                  {days[sch.day_of_week]}
                                </span>
                                <span className="text-xs font-semibold text-muted-foreground flex items-center mt-1">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {sch.start_time.substring(0, 5)} às {sch.end_time.substring(0, 5)}
                                  {sch.room && (
                                    <>
                                      <span className="mx-1.5">•</span>
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {sch.room}
                                    </>
                                  )}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
