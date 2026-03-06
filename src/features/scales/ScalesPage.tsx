import React, { useState } from 'react';
import { CalendarRange, Users, Award } from 'lucide-react';
import { PeopleTab } from './components/PeopleTab';
import { RolesTab } from './components/RolesTab';
import { SchedulesTab } from './components/SchedulesTab';

type TabType = 'scales' | 'people' | 'roles';

export const ScalesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('scales');

  return (
    <div className="space-y-8 animate-in fade-in duration-700 print:space-y-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Gerador de <span className="text-primary italic">Escalas</span></h1>
          <p className="text-muted-foreground font-medium mt-1">Gerencie membros, funções e gere escalas inteligentes automaticamente.</p>
        </div>

        <div className="flex bg-muted/50 p-1.5 rounded-2xl border border-border">
          <button
            onClick={() => setActiveTab('scales')}
            className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'scales' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <CalendarRange className="w-4 h-4 mr-2" />
            Escalas
          </button>
          <button
            onClick={() => setActiveTab('people')}
            className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'people' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Pessoas
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex items-center px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'roles' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Award className="w-4 h-4 mr-2" />
            Funções
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm print:border-none print:shadow-none print:p-0 print:rounded-none">
        {activeTab === 'scales' && <SchedulesTab />}
        {activeTab === 'people' && <PeopleTab />}
        {activeTab === 'roles' && <RolesTab />}
      </div>
    </div>
  );
};
