import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useUpsertSchedule, Schedule } from '../useAcademic';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule?: Schedule | null;
  classId: string;
}

const DIAS_DA_SEMANA = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
];

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, schedule, classId }) => {
  const [dayOfWeek, setDayOfWeek] = useState<number>(1); // 1 = Segunda
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [room, setRoom] = useState('');
  
  const { mutateAsync: upsertSchedule, isPending } = useUpsertSchedule();

  useEffect(() => {
    if (schedule) {
      setDayOfWeek(schedule.day_of_week);
      setStartTime(schedule.start_time.substring(0, 5)); // "08:00:00" -> "08:00"
      setEndTime(schedule.end_time.substring(0, 5));
      setRoom(schedule.room || '');
    } else {
      setDayOfWeek(1);
      setStartTime('');
      setEndTime('');
      setRoom('');
    }
  }, [schedule, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upsertSchedule({
        ...(schedule?.id ? { id: schedule.id } : {}),
        class_id: classId,
        day_of_week: dayOfWeek,
        start_time: startTime + ':00', // needs HH:MM:SS
        end_time: endTime + ':00',
        room: room || null,
      });
      onClose();
    } catch (error: any) {
      alert(error.message || 'Erro ao salvar horário');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full max-w-md rounded-3xl shadow-2xl border border-border p-6 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {schedule ? 'Editar Horário' : 'Novo Horário'}
          </h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Dia da Semana <span className="text-red-500">*</span></label>
            <select
              required
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(Number(e.target.value))}
            >
              {DIAS_DA_SEMANA.map((dia, idx) => (
                <option key={idx} value={idx}>{dia}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-semibold mb-2">Início <span className="text-red-500">*</span></label>
                <input
                  type="time"
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
             </div>
             <div>
                <label className="block text-sm font-semibold mb-2">Fim <span className="text-red-500">*</span></label>
                <input
                  type="time"
                  required
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
             </div>
          </div>

          <div>
             <label className="block text-sm font-semibold mb-2">Sala / Local</label>
             <input
               type="text"
               placeholder="Ex: Sala 01, Biblioteca..."
               className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
               value={room}
               onChange={(e) => setRoom(e.target.value)}
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
              disabled={isPending || !startTime || !endTime}
              className="flex items-center justify-center px-6 py-3 text-sm font-bold bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Horário'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
