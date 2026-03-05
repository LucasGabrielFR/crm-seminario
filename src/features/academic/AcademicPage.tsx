import React, { useState } from 'react';
import { BookOpen, CalendarDays, Settings } from 'lucide-react';
import { CoursesTab } from './components/CoursesTab';
import { ClassesTab } from './components/ClassesTab';
import { TeacherPortalTab } from './components/TeacherPortalTab';
import { StudentPortalTab } from './components/StudentPortalTab';
import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../lib/supabase';

export const AcademicPage: React.FC = () => {
  const { session } = useAuth();
  
  // Buscar perfil atual para verificar a role
  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id,
  });

  const isAdminOrFormador = profile?.role === 'admin' || profile?.role === 'formador';
  const isProfessor = profile?.role === 'professor';

  // Define a aba inicial com base no papel
  const initialTab = isAdminOrFormador ? 'courses' : (isProfessor ? 'teacher' : 'student');
  const [activeTab, setActiveTab] = useState(initialTab);

  // Tabs de Admin
  const adminTabs = [
    { id: 'courses', label: 'Cursos & Disciplinas', icon: BookOpen },
    { id: 'classes', label: 'Turmas & Horários', icon: CalendarDays },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'courses':
        return <CoursesTab />;
      case 'classes':
        return <ClassesTab />;
      case 'teacher':
        return <TeacherPortalTab />;
      case 'student':
        return <StudentPortalTab />;
      case 'settings':
        return <div className="p-8 text-center text-muted-foreground">Configurações (Em breve)</div>;
      default:
        return null;
    }
  };

  if (!profile) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Módulo Acadêmico</h1>
        <p className="text-muted-foreground font-medium mt-1">Gestão de cursos, turmas, notas e boletins.</p>
      </div>

      {isAdminOrFormador && (
        <div className="flex space-x-2 border-b border-border pb-px overflow-x-auto overflow-y-hidden">
          {adminTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Se não for admin, não mostra a barra de abas e renderiza direto a visão específica */}
      <div className="bg-card rounded-3xl shadow-2xl shadow-primary/5 border border-border overflow-hidden min-h-[500px]">
        {renderContent()}
      </div>
    </div>
  );
};
