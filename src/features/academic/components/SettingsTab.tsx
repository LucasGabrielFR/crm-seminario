import React, { useState, useEffect } from 'react';
import { useAcademicSettings, useUpdateAcademicSettings } from '../useAcademic';
import { Save, Loader2, CheckCircle2 } from 'lucide-react';

export const SettingsTab: React.FC = () => {
  const { data: settings, isLoading } = useAcademicSettings();
  const { mutateAsync: updateSettings, isPending } = useUpdateAcademicSettings();
  
  const [n1Weight, setN1Weight] = useState<string>('5');
  const [n2Weight, setN2Weight] = useState<string>('5');
  const [passingGrade, setPassingGrade] = useState<string>('7');
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (settings) {
      setN1Weight(settings.n1_weight.toString());
      setN2Weight(settings.n2_weight.toString());
      setPassingGrade(settings.passing_grade.toString());
    }
  }, [settings]);

  const handleSave = async () => {
    if (!settings?.id) return;
    
    try {
      setSaveStatus('idle');
      await updateSettings({
        id: settings.id,
        n1_weight: parseFloat(n1Weight),
        n2_weight: parseFloat(n2Weight),
        passing_grade: parseFloat(passingGrade),
      });
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch(err) {
      console.error(err);
      setSaveStatus('error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Carregando configurações...
      </div>
    );
  }

  const w1 = parseFloat(n1Weight) || 0;
  const w2 = parseFloat(n2Weight) || 0;
  const totalWeight = w1 + w2;
  const isInvalidWeight = totalWeight !== 10;

  return (
    <div className="p-6 max-w-2xl animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Configurações Acadêmicas</h2>

      <div className="space-y-6 bg-card border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <h3 className="text-lg font-bold mb-1">Fórmulas de Notas</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Defina o peso de cada nota na composição da média final do estudante. A soma dos pesos deve obrigatoriamente ser igual a 10.
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <label className="block text-sm font-semibold mb-1">Peso da Nota 1 (N1)</label>
              <input 
                type="number"
                min="0" max="10" step="0.1"
                className="w-full bg-background border border-border px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                value={n1Weight}
                onChange={(e) => setN1Weight(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Peso da Nota 2 (N2)</label>
              <input 
                type="number"
                min="0" max="10" step="0.1"
                className="w-full bg-background border border-border px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                value={n2Weight}
                onChange={(e) => setN2Weight(e.target.value)}
              />
            </div>
          </div>
          
          <div className={`text-sm font-semibold p-3 rounded-lg flex items-center justify-between ${isInvalidWeight ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-600'}`}>
            <span>Soma dos pesos: {totalWeight.toFixed(1)}</span>
            {isInvalidWeight && <span>A soma deve ser exatamente 10.</span>}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <h3 className="text-lg font-bold mb-1">Critério de Aprovação</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Defina qual é a nota mínima para que a média do estudante seja considerada "Aprovado".
          </p>
          
          <div className="lg:w-1/2">
            <label className="block text-sm font-semibold mb-1">Média Mínima para Aprovação</label>
            <input 
              type="number"
              min="0" max="10" step="0.1"
              className="w-full bg-background border border-border px-3 py-2 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
              value={passingGrade}
              onChange={(e) => setPassingGrade(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end gap-3 items-center">
            {saveStatus === 'success' && <span className="text-green-500 text-sm font-bold flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" /> Salvo com sucesso</span>}
            {saveStatus === 'error' && <span className="text-red-500 text-sm font-bold flex items-center">Erro ao salvar configurações</span>}
            
            <button
                onClick={handleSave}
                disabled={isPending || isInvalidWeight}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center"
            >
                {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Salvar Configurações
            </button>
        </div>
      </div>
    </div>
  );
};
