import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useUpsertSubject, Subject } from '../useAcademic';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject?: Subject | null;
  courseId: string;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({ isOpen, onClose, subject, courseId }) => {
  const [name, setName] = useState('');
  const [workload, setWorkload] = useState<number | ''>(40);
  const [credits, setCredits] = useState<number | ''>(4);
  const { mutateAsync: upsertSubject, isPending } = useUpsertSubject();

  useEffect(() => {
    if (subject) {
      setName(subject.name);
      setWorkload(subject.workload);
      setCredits(subject.credits);
    } else {
      setName('');
      setWorkload(40);
      setCredits(4);
    }
  }, [subject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workload) return;

    try {
      await upsertSubject({
        ...(subject?.id ? { id: subject.id } : {}),
        course_id: courseId,
        name,
        workload: Number(workload),
        credits: Number(credits),
      });
      onClose();
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar disciplina');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border p-6 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {subject ? 'Editar Disciplina' : 'Nova Disciplina'}
          </h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Nome da Disciplina <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              placeholder="Ex: Introdução à Filosofia"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Carga Horária (h) <span className="text-red-500">*</span></label>
              <input
                type="number"
                required
                min={1}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={workload}
                onChange={(e) => setWorkload(e.target.value ? Number(e.target.value) : '')}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Créditos <span className="text-red-500">*</span></label>
              <input
                type="number"
                required
                min={1}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                value={credits}
                onChange={(e) => setCredits(e.target.value ? Number(e.target.value) : '')}
              />
            </div>
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
              disabled={isPending || !name || workload === '' || credits === ''}
              className="flex items-center justify-center px-6 py-3 text-sm font-bold bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Disciplina'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
