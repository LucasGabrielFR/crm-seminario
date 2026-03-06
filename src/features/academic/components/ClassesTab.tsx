import React, { useState } from 'react';
import { 
  useClasses, useDeleteClass, useDeleteSchedule, useUpsertEnrollment, useDeleteEnrollment,
  ClassWithDetails, Schedule, ClassType
} from '../useAcademic';
import { useUsers } from '../../users/useUsers';
import { ClassModal } from './ClassModal';
import { ScheduleModal } from './ScheduleModal';
import { Users, Calendar, Watch, Trash2, Plus, UsersRound, Book, Pencil, Loader2, ChevronDown, ChevronRight, GraduationCap } from 'lucide-react';

const DIAS_DA_SEMANA = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export const ClassesTab: React.FC = () => {
  const { data: classes, isLoading } = useClasses();
  const { data: users } = useUsers();
  
  const { mutateAsync: deleteClass, isPending: isDeletingClass } = useDeleteClass();
  const { mutateAsync: deleteSchedule } = useDeleteSchedule();
  const { mutateAsync: upsertEnrollment, isPending: isEnrolling } = useUpsertEnrollment();
  const { mutateAsync: deleteEnrollment } = useDeleteEnrollment();

  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassType | null>(null);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedClassForSchedule, setSelectedClassForSchedule] = useState<string>('');
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  
  const [studentToEnroll, setStudentToEnroll] = useState<string>('');

  const activeStudents = users?.filter(u => u.role === 'seminarista') || [];

  const handleEditClass = (e: React.MouseEvent, c: ClassType) => {
    e.stopPropagation();
    setEditingClass(c);
    setIsClassModalOpen(true);
  };

  const handleDeleteClass = async (e: React.MouseEvent, classId: string, subjectName: string) => {
    e.stopPropagation();
    if (confirm(`Tem certeza que deseja excluir a turma de ${subjectName}?\nEsta ação removerá todos os alunos e horários vinculados.`)) {
      try {
        await deleteClass(classId);
      } catch (err: any) {
        alert(err.message || 'Erro ao excluir turma');
      }
    }
  };

  const handleAddSchedule = (classId: string) => {
    setEditingSchedule(null);
    setSelectedClassForSchedule(classId);
    setIsScheduleModalOpen(true);
  };

  const handleEditSchedule = (schedule: Schedule, classId: string) => {
    setEditingSchedule(schedule);
    setSelectedClassForSchedule(classId);
    setIsScheduleModalOpen(true);
  };

  const handleDeleteSchedule = async (scheduleId: string) => {
    if (confirm('Tem certeza que deseja excluir este horário?')) {
      try {
         await deleteSchedule(scheduleId);
      } catch (err: any) {
         alert(err.message || 'Erro ao excluir horário');
      }
    }
  };

  const handleEnrollStudent = async (classId: string) => {
    if (!studentToEnroll) return;
    try {
      await upsertEnrollment({
        class_id: classId,
        student_id: studentToEnroll,
        status: 'cursando'
      });
      setStudentToEnroll('');
    } catch (err: any) {
      alert(err.message || 'Erro ao matricular aluno. Talvez ele já esteja matriculado.');
    }
  };

  const handleRemoveEnrollment = async (enrollmentId: string, studentName: string) => {
    if (confirm(`Remover matrícula de ${studentName}?`)) {
      try {
         await deleteEnrollment(enrollmentId);
      } catch (err: any) {
         alert(err.message || 'Erro ao remover matrícula');
      }
    }
  };

  return (
    <div className="p-6 md:p-10 text-foreground">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Turmas e Horários</h2>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Gerencie as turmas, horários de aulas e alunos matriculados.</p>
        </div>
        <button
          onClick={() => { setEditingClass(null); setIsClassModalOpen(true); }}
          className="flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nova Turma
        </button>
      </div>

      <ClassModal
        isOpen={isClassModalOpen}
        onClose={() => setIsClassModalOpen(false)}
        classe={editingClass}
      />
      
      {selectedClassForSchedule && (
        <ScheduleModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          schedule={editingSchedule}
          classId={selectedClassForSchedule}
        />
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-sm font-medium text-muted-foreground">Carregando turmas...</p>
        </div>
      ) : classes?.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl mt-4">
          <UsersRound className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Nenhuma turma cadastrada.</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Comece criando a primeira turma e não esqueça de definir a disciplina e o professor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {classes?.map((c: ClassWithDetails) => (
            <div key={c.id} className="bg-background border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors shadow-sm">
              <div 
                className="p-5 flex items-center justify-between cursor-pointer group hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedClass(expandedClass === c.id ? null : c.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${expandedClass === c.id ? 'bg-primary text-primary-foreground shadow-md' : 'bg-primary/10 text-primary'}`}>
                    <Book className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                       {c.subjects?.name || 'Disciplina Desconhecida'}
                       <span className="text-[10px] uppercase font-black tracking-widest bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                         Semestre {c.semester}
                       </span>
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1 mt-1 font-medium flex items-center gap-4">
                       <span className="flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5"/> {c.profiles?.full_name || 'Sem Professor'}</span>
                       <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5"/> {c.enrollments?.length || 0} alunos</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditClass(e, c)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Editar Turma"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      disabled={isDeletingClass}
                      onClick={(e) => handleDeleteClass(e, c.id, c.subjects?.name || 'Turma')}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Excluir Turma"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-muted-foreground">
                    {expandedClass === c.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* CONTEÚDO EXPANDIDO */}
              {expandedClass === c.id && (
                <div className="border-t border-border bg-muted/20 p-5 md:p-8 animate-in slide-in-from-top-2 duration-200">
                   
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {/* HORÁRIOS */}
                     <div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-foreground flex items-center gap-2"><Calendar className="w-4 h-4 text-primary"/> Horários</h4>
                          <button
                            onClick={() => handleAddSchedule(c.id)}
                            className="flex items-center text-xs font-bold bg-background border border-border px-3 py-1.5 rounded-lg hover:border-primary hover:text-primary transition-colors shadow-sm"
                          >
                            <Plus className="w-3 h-3 mr-1.5" />
                            Novo Horário
                          </button>
                        </div>
                        
                        {c.class_schedules?.length === 0 ? (
                            <div className="text-center py-6 bg-background rounded-xl border border-dashed border-border">
                               <p className="text-sm text-muted-foreground font-medium">Nenhum horário cadastrado para essa turma.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                               {c.class_schedules?.map((sched: Schedule) => (
                                 <div key={sched.id} className="bg-background border border-border rounded-xl p-3 flex justify-between items-center group shadow-sm">
                                    <div>
                                       <p className="font-bold text-sm text-foreground">{DIAS_DA_SEMANA[sched.day_of_week]}</p>
                                       <p className="text-xs font-medium text-muted-foreground mt-0.5 flex items-center gap-1.5">
                                          <Watch className="w-3 h-3" />
                                          {sched.start_time.substring(0,5)} as {sched.end_time.substring(0,5)}
                                          {sched.room && ` • Sala: ${sched.room}`}
                                       </p>
                                    </div>
                                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button onClick={() => handleEditSchedule(sched, c.id)} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                                       <button onClick={() => handleDeleteSchedule(sched.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                 </div>
                               ))}
                            </div>
                        )}
                     </div>

                     {/* ALUNOS */}
                     <div>
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-bold text-foreground flex items-center gap-2"><UsersRound className="w-4 h-4 text-primary"/> Alunos da Turma</h4>
                        </div>
                        
                        <div className="flex gap-2 mb-4">
                           <select 
                             className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                             value={studentToEnroll}
                             onChange={(e) => setStudentToEnroll(e.target.value)}
                           >
                              <option value="" disabled>Selecione um aluno p/ matricular...</option>
                              {activeStudents.filter(u => !c.enrollments?.some(e => e.student_id === u.id)).map(st => (
                                 <option key={st.id} value={st.id}>{st.full_name}</option>
                              ))}
                           </select>
                           <button 
                             disabled={!studentToEnroll || isEnrolling}
                             onClick={() => handleEnrollStudent(c.id)}
                             className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                           >
                             {isEnrolling ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Matricular'}
                           </button>
                        </div>

                        {c.enrollments?.length === 0 ? (
                            <div className="text-center py-6 bg-background rounded-xl border border-dashed border-border">
                               <p className="text-sm text-muted-foreground font-medium">Nenhum aluno matriculado.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                               {c.enrollments?.map((enrollment) => (
                                 <div key={enrollment.id} className="bg-background border border-border rounded-xl p-3 flex justify-between items-center group shadow-sm">
                                    <div>
                                       <p className="font-bold text-sm text-foreground">{enrollment.profiles?.full_name}</p>
                                       <p className="text-xs font-medium text-muted-foreground mt-0.5 uppercase tracking-wider">Status: <span className="text-primary">{enrollment.status}</span></p>
                                    </div>
                                    <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button onClick={() => handleRemoveEnrollment(enrollment.id, enrollment.profiles?.full_name || '')} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors" title="Remover Matrícula"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                 </div>
                               ))}
                            </div>
                        )}
                     </div>
                   </div>

                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
