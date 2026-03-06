import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useUpsertClass, ClassType, useCourses, CourseWithSubjects } from '../useAcademic';
import { useUsers, Profile } from '../../users/useUsers';

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classe?: ClassType | null;
}

export const ClassModal: React.FC<ClassModalProps> = ({ isOpen, onClose, classe }) => {
  const [subjectId, setSubjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [semester, setSemester] = useState('');
  
  const { mutateAsync: upsertClass, isPending } = useUpsertClass();
  const { data: courses } = useCourses();
  const { data: users } = useUsers();
  
  const teachers = users?.filter(u => u.role === 'professor' || u.is_teacher) || [];
  
  useEffect(() => {
    if (classe) {
      setSubjectId(classe.subject_id);
      setTeacherId(classe.teacher_id);
      setSemester(classe.semester);
    } else {
      setSubjectId('');
      setTeacherId('');
      setSemester('');
    }
  }, [classe, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsertClass({
        ...(classe?.id ? { id: classe.id } : {}),
        subject_id: subjectId,
        teacher_id: teacherId,
        semester,
      });
      onClose();
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar turma');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border p-6 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {classe ? 'Editar Turma' : 'Nova Turma'}
          </h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Disciplina <span className="text-red-500">*</span></label>
            <select
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
            >
              <option value="" disabled>Selecione uma disciplina...</option>
              {courses?.map((course: CourseWithSubjects) => (
                <optgroup key={course.id} label={course.name}>
                  {course.subjects?.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Professor Responsável <span className="text-red-500">*</span></label>
            <select
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
            >
              <option value="" disabled>Selecione um professor...</option>
              {teachers.map((t: Profile) => (
                <option key={t.id} value={t.id}>{t.full_name}</option>
              ))}
            </select>
          </div>

          <div>
             <label className="block text-sm font-semibold mb-2">Semestre Base <span className="text-red-500">*</span></label>
             <input
               type="text"
               required
               placeholder="Ex: 2026.1"
               className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
               value={semester}
               onChange={(e) => setSemester(e.target.value)}
             />
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-muted-foreground hover:bg-muted rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || !subjectId || !teacherId || !semester}
              className="flex items-center justify-center px-6 py-3 text-sm font-bold bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Turma'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
