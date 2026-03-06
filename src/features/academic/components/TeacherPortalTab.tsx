import React, { useState, useEffect } from 'react';
import { useClasses, useUpsertEnrollment, Enrollment } from '../useAcademic';
import { useAuth } from '../../../hooks/useAuth';
import { BookOpen, Users, ChevronDown, ChevronUp, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

type EnrollmentWithProfile = Enrollment & { profiles?: { full_name: string | null } | null };

const StudentRow: React.FC<{ enrollment: EnrollmentWithProfile; classId: string }> = ({ enrollment, classId }) => {
  const [n1, setN1] = useState<string>(enrollment.n1_grade?.toString() || '');
  const [n2, setN2] = useState<string>(enrollment.n2_grade?.toString() || '');
  const [absences, setAbsences] = useState<string>(enrollment.absences?.toString() || '0');
  const [isModified, setIsModified] = useState(false);
  
  const { mutateAsync: updateEnrollment, isPending } = useUpsertEnrollment();
  const [savedData, setSavedData] = useState({ n1, n2, absences });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (n1 !== savedData.n1 || n2 !== savedData.n2 || absences !== savedData.absences) {
      setIsModified(true);
      setSaveStatus('idle');
    } else {
      setIsModified(false);
    }
  }, [n1, n2, absences, savedData]);

  const handleSave = async () => {
    try {
      await updateEnrollment({
        id: enrollment.id,
        class_id: classId,
        student_id: enrollment.student_id,
        n1_grade: n1 ? parseFloat(n1) : null,
        n2_grade: n2 ? parseFloat(n2) : null,
        absences: absences ? parseInt(absences, 10) : 0,
      });
      setSavedData({ n1, n2, absences });
      setIsModified(false);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    }
  };

  const calculateMedia = () => {
    if (!n1 || !n2) return null;
    const mean = (parseFloat(n1) + parseFloat(n2)) / 2;
    return mean.toFixed(1);
  };

  const media = calculateMedia();

  return (
    <tr className="border-b border-border hover:bg-muted/20 transition-colors">
      <td className="px-4 py-3 font-semibold w-1/3">
        {enrollment.profiles?.full_name || 'Aluno Desconhecido'}
      </td>
      <td className="px-4 py-3">
        <input 
          type="number" 
          min="0" max="10" step="0.1"
          className="w-20 px-2 py-1 bg-background border border-border rounded focus:ring-2 focus:ring-primary/20 outline-none"
          value={n1}
          onChange={e => setN1(e.target.value)}
        />
      </td>
      <td className="px-4 py-3">
        <input 
          type="number" 
          min="0" max="10" step="0.1"
          className="w-20 px-2 py-1 bg-background border border-border rounded focus:ring-2 focus:ring-primary/20 outline-none"
          value={n2}
          onChange={e => setN2(e.target.value)}
        />
      </td>
      <td className="px-4 py-3 font-bold">
        {media ? (
          <span className={parseFloat(media) >= 7 ? 'text-green-600' : 'text-red-500'}>
            {media}
          </span>
        ) : '-'}
      </td>
      <td className="px-4 py-3">
        <input 
          type="number" 
          min="0"
          className="w-20 px-2 py-1 bg-background border border-border rounded focus:ring-2 focus:ring-primary/20 outline-none"
          value={absences}
          onChange={e => setAbsences(e.target.value)}
        />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {isModified ? (
            <button 
              onClick={handleSave}
              disabled={isPending}
              className="flex items-center px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded hover:opacity-90 transition-all shadow shadow-primary/20 disabled:opacity-50"
            >
              {isPending ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
              Salvar
            </button>
          ) : (
            <div className="w-[84px]"></div>
          )}
          {saveStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
          {saveStatus === 'error' && (
            <div title="Erro ao salvar">
              <AlertCircle className="w-4 h-4 text-red-500" />
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export const TeacherPortalTab: React.FC = () => {
  const { profile } = useAuth();
  const { data: classes, isLoading } = useClasses();
  const [expandedClasses, setExpandedClasses] = useState<string[]>([]);

  const toggleClass = (id: string) => {
    setExpandedClasses(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Carregando turmas...
      </div>
    );
  }

  const teacherClasses = classes?.filter(c => c.teacher_id === profile?.id) || [];

  return (
    <div className="animate-in fade-in duration-500">
      {teacherClasses.length === 0 ? (
        <div className="bg-card p-12 rounded-3xl border border-border text-center shadow-sm">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold">Nenhuma turma encontrada</h3>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            Você ainda não foi designado(a) como professor de nenhuma turma ativa no momento.
          </p>
        </div>
      ) : (
        <div className="space-y-3 p-6 bg-muted/10">
          {teacherClasses.map((cls) => (
            <div key={cls.id} className="bg-background rounded-2xl shadow-sm border border-border overflow-hidden transition-all duration-300">
              <div 
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleClass(cls.id)}
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold">{cls.subjects?.name}</h3>
                    <span className="bg-primary/10 text-primary text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-wider shadow-sm">
                      {cls.semester}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground flex items-center mt-1">
                    <Users className="w-4 h-4 mr-1.5" />
                    {cls.enrollments?.length || 0} alunos matriculados
                  </div>
                </div>
                <div className="p-2 bg-muted rounded-full text-foreground hover:bg-muted-foreground/20 transition-colors">
                  {expandedClasses.includes(cls.id) ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>

              {expandedClasses.includes(cls.id) && (
                <div className="border-t border-border bg-background/50">
                  {(!cls.enrollments || cls.enrollments.length === 0) ? (
                    <div className="p-8 text-center text-muted-foreground">
                      Esta turma ainda não possui nenhum aluno matriculado.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-black tracking-wider">
                            <th className="px-4 py-3">Aluno</th>
                            <th className="px-4 py-3">Nota 1</th>
                            <th className="px-4 py-3">Nota 2</th>
                            <th className="px-4 py-3">Média</th>
                            <th className="px-4 py-3">Faltas</th>
                            <th className="px-4 py-3">Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cls.enrollments.map((enr) => (
                            <StudentRow key={enr.id} enrollment={enr} classId={cls.id} />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
