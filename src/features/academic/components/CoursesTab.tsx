import React, { useState } from 'react';
import { useCourses, useDeleteCourse, useDeleteSubject, CourseWithSubjects, Course, Subject } from '../useAcademic';
import { CourseModal } from './CourseModal';
import { SubjectModal } from './SubjectModal';
import { BookOpen, Book, Plus, Pencil, Trash2, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';

export const CoursesTab: React.FC = () => {
  const { data: courses, isLoading } = useCourses();
  const { mutateAsync: deleteCourse, isPending: isDeletingCourse } = useDeleteCourse();
  const { mutateAsync: deleteSubject, isPending: isDeletingSubject } = useDeleteSubject();

  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [selectedCourseForSubject, setSelectedCourseForSubject] = useState<string>('');

  const handleEditCourse = (e: React.MouseEvent, course: Course) => {
    e.stopPropagation();
    setEditingCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleDeleteCourse = async (e: React.MouseEvent, courseId: string, courseName: string) => {
    e.stopPropagation();
    if (confirm(`Tem certeza que deseja excluir o curso "${courseName}"?\nATENÇÃO: Todas as disciplinas vinculadas serão excluídas.`)) {
      try {
        await deleteCourse(courseId);
      } catch (err: any) {
        alert(err.message || 'Erro ao excluir');
      }
    }
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setSelectedCourseForSubject(subject.course_id);
    setIsSubjectModalOpen(true);
  };

  const handleAddSubject = (courseId: string) => {
    setEditingSubject(null);
    setSelectedCourseForSubject(courseId);
    setIsSubjectModalOpen(true);
  };

  const handleDeleteSubject = async (subjectId: string, subjectName: string) => {
    if (confirm(`Tem certeza que deseja excluir a disciplina "${subjectName}"?`)) {
      try {
        await deleteSubject(subjectId);
      } catch (err: any) {
        alert(err.message || 'Erro ao excluir disciplina');
      }
    }
  };

  const openNewCourseModal = () => {
    setEditingCourse(null);
    setIsCourseModalOpen(true);
  };

  return (
    <div className="p-6 md:p-10 text-foreground">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cursos e Disciplinas</h2>
          <p className="text-muted-foreground mt-1 text-sm font-medium">Crie os cursos e suas matrizes curriculares (disciplinas).</p>
        </div>
        <button
          onClick={openNewCourseModal}
          className="flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Curso
        </button>
      </div>

      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        course={editingCourse}
      />
      
      {selectedCourseForSubject && (
        <SubjectModal
          isOpen={isSubjectModalOpen}
          onClose={() => setIsSubjectModalOpen(false)}
          subject={editingSubject}
          courseId={selectedCourseForSubject}
        />
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-sm font-medium text-muted-foreground">Carregando cursos...</p>
        </div>
      ) : courses?.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl mt-4">
          <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-bold mb-2">Nenhum curso cadastrado.</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            Comece criando o seu primeiro curso (ex: Teologia, Filosofia) para depois adicionar suas disciplinas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {courses?.map((course: CourseWithSubjects) => (
            <div key={course.id} className="bg-background border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors shadow-sm">
              <div 
                className="p-5 flex items-center justify-between cursor-pointer group hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${expandedCourse === course.id ? 'bg-primary text-primary-foreground shadow-md' : 'bg-primary/10 text-primary'}`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                       {course.name}
                       <span className="text-[10px] uppercase font-black tracking-widest bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                         {course.subjects?.length || 0} disciplinas
                       </span>
                    </h3>
                    {course.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{course.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => handleEditCourse(e, course)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Editar Curso"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      disabled={isDeletingCourse}
                      onClick={(e) => handleDeleteCourse(e, course.id, course.name)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Excluir Curso"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-muted-foreground">
                    {expandedCourse === course.id ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {expandedCourse === course.id && (
                <div className="border-t border-border bg-muted/20 p-5 md:p-8 animate-in slide-in-from-top-2 duration-200">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="font-bold text-foreground">Grade Curricular</h4>
                    <button
                      onClick={() => handleAddSubject(course.id)}
                      className="flex items-center text-xs font-bold bg-background border border-border px-3 py-1.5 rounded-lg hover:border-primary hover:text-primary transition-colors shadow-sm"
                    >
                      <Plus className="w-3 h-3 mr-1.5" />
                      Nova Disciplina
                    </button>
                  </div>

                  {course.subjects?.length === 0 ? (
                    <div className="text-center py-10 bg-background rounded-xl border border-dashed border-border">
                       <p className="text-sm text-muted-foreground font-medium">Este curso ainda não possui disciplinas cadastradas.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {course.subjects?.map((subject) => (
                        <div key={subject.id} className="bg-background rounded-xl p-4 border border-border flex items-start justify-between group hover:border-primary/40 transition-colors shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              <Book className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                               <p className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">{subject.name}</p>
                               <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                                 {subject.workload} horas • {subject.credits} {subject.credits === 1 ? 'crédito' : 'créditos'}
                               </p>
                            </div>
                          </div>
                          
                          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditSubject(subject)}
                              className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                              title="Editar Disciplina"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={isDeletingSubject}
                              onClick={() => handleDeleteSubject(subject.id, subject.name)}
                              className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                              title="Excluir Disciplina"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
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
