import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useUpsertCourse, Course } from '../useAcademic';

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: Course | null;
}

export const CourseModal: React.FC<CourseModalProps> = ({ isOpen, onClose, course }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { mutateAsync: upsertCourse, isPending } = useUpsertCourse();

  useEffect(() => {
    if (course) {
      setName(course.name);
      setDescription(course.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [course, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsertCourse({
        ...(course?.id ? { id: course.id } : {}),
        name,
        description,
      });
      onClose();
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar curso');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border p-6 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {course ? 'Editar Curso' : 'Novo Curso'}
          </h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nome do Curso <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              placeholder="Ex: Teologia"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Descrição</label>
            <textarea
              placeholder="Descreva o curso (opcional)"
              rows={3}
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              disabled={isPending || !name}
              className="flex items-center justify-center px-6 py-3 text-sm font-bold bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Curso'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
