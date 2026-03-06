
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  CalendarRange, 
  ClipboardList, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { useUsers } from '../users/useUsers';
import { useBookLoans, useBooks, useBookRequests } from '../library/useLibrary';
import { useClasses } from '../academic/useAcademic';
import { useScaleSchedules } from '../scales/useScales';

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const { data: users } = useUsers();
  const { data: books } = useBooks();
  const { data: loans } = useBookLoans();
  const { data: requests } = useBookRequests();
  const { data: classes } = useClasses();
  const { data: schedules } = useScaleSchedules();

  const isAdmin = profile?.role === 'admin' || profile?.role === 'formador';
  const isLibrarian = profile?.is_librarian;

  // Library Stats
  const activeLoans = loans?.filter((l: any) => l.status === 'active') || [];
  const overdueLoans = loans?.filter((l: any) => l.status === 'overdue') || [];
  const itemsReturned = loans?.filter((l: any) => l.status === 'returned') || [];
  const pendingRequests = requests?.filter((r: any) => r.status === 'pending') || [];

  // User Stats
  const students = users?.filter((u: any) => u.role === 'seminarista') || [];
  const teachers = users?.filter((u: any) => u.role === 'professor') || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-foreground">
          Dashboard <span className="text-primary italic">Global</span>
        </h1>
        <p className="text-muted-foreground font-medium mt-1">
          Bem-vindo de volta, <span className="text-foreground font-bold">{profile?.full_name}</span>. Aqui está o que está acontecendo hoje.
        </p>
      </div>

      {/* Admin / Formador View */}
      {isAdmin && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-black uppercase tracking-widest text-muted-foreground">Visão Institucional</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Seminaristas" 
              value={students.length} 
              icon={Users} 
              color="primary" 
              description="Seminaristas em formação"
            />
            <StatCard 
              title="Professores" 
              value={teachers.length} 
              icon={UserCheck} 
              color="orange" 
              description="Corpo docente ativo"
            />
            <StatCard 
              title="Turmas Ativas" 
              value={classes?.length || 0} 
              icon={GraduationCap} 
              color="blue" 
              description="Disciplinas em andamento"
            />
            <StatCard 
              title="Escalas Ativas" 
              value={schedules?.length || 0} 
              icon={CalendarRange} 
              color="green" 
              description="Escalas geradas"
            />
          </div>
        </section>
      )}

      {/* Librarian / Shared Library View */}
      {(isLibrarian || isAdmin) && (
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-black uppercase tracking-widest text-muted-foreground text-foreground">Gestão de Biblioteca</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total de Livros" 
              value={books?.length || 0} 
              icon={BookOpen} 
              color="indigo" 
              description="Títulos catalogados"
            />
            <StatCard 
              title="Solicitações" 
              value={pendingRequests.length} 
              icon={ClipboardList} 
              color="yellow" 
              description="Aguardando aprovação"
              alert={pendingRequests.length > 0}
            />
            <StatCard 
              title="Em Empréstimo" 
              value={activeLoans.length} 
              icon={Clock} 
              color="primary" 
              description="Livros fora do acervo"
            />
            <StatCard 
              title="Atrasados" 
              value={overdueLoans.length} 
              icon={AlertCircle} 
              color="red" 
              description="Devoluções pendentes"
              alert={overdueLoans.length > 0}
            />
          </div>
        </section>
      )}

      {/* Activity Summary (Shared) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
           <h3 className="text-xl font-black mb-6 flex items-center gap-2">
             <CheckCircle2 className="w-6 h-6 text-green-500" />
             Resumo de Atividades
           </h3>
           <div className="space-y-6">
              <ActivityItem 
                label="Livros devolvidos (Total)" 
                value={itemsReturned.length} 
                sub="Eficiência da biblioteca"
              />
              <ActivityItem 
                label="Matrículas realizadas" 
                value={classes?.reduce((acc: number, c: any) => acc + (c.enrollments?.length || 0), 0) || 0} 
                sub="Engajamento acadêmico"
              />
              <ActivityItem 
                label="Membros Cadastrados" 
                value={users?.length || 0} 
                sub="Crescimento da base"
              />
           </div>
        </div>

        {/* Quick Links Card */}
        <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 flex flex-col justify-center relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-2">Acesso Rápido</h3>
            <p className="text-muted-foreground font-medium mb-6">Navegue rapidamente para os principais módulos do Vocare CRM.</p>
            <div className="flex gap-4 flex-wrap">
              <QuickLink icon={Users} label="Pessoas" href="/users" />
              <QuickLink icon={BookOpen} label="Biblioteca" href="/library" />
              <QuickLink icon={GraduationCap} label="Acadêmico" href="/academic" />
              <QuickLink icon={CalendarRange} label="Escalas" href="/scales" />
            </div>
          </div>
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700"></div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: any;
  color: 'primary' | 'orange' | 'blue' | 'green' | 'red' | 'indigo' | 'yellow';
  description: string;
  alert?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, description, alert }) => {
  const colorClasses = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    orange: 'text-orange-600 bg-orange-500/10 border-orange-500/20',
    blue: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
    green: 'text-green-600 bg-green-500/10 border-green-500/20',
    red: 'text-red-500 bg-red-500/10 border-red-500/20',
    indigo: 'text-indigo-600 bg-indigo-500/10 border-indigo-500/20',
    yellow: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20',
  };

  return (
    <div className={`bg-card p-6 rounded-[2rem] border border-border shadow-sm group hover:scale-[1.02] transition-all duration-300 relative ${alert ? 'ring-2 ring-red-500 ring-offset-4 dark:ring-offset-slate-950' : ''}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12 ${colorClasses[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">{title}</h3>
        <p className="text-3xl font-black mt-1">{value}</p>
        <p className="text-xs text-muted-foreground mt-2 font-medium">{description}</p>
      </div>
      {alert && (
        <span className="absolute top-4 right-4 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
      )}
    </div>
  );
};

const ActivityItem = ({ label, value, sub }: { label: string; value: number; sub: string }) => (
  <div className="flex items-center justify-between p-4 bg-muted/20 border border-transparent hover:border-border rounded-2xl transition-all">
    <div>
      <div className="text-sm font-bold text-foreground">{label}</div>
      <div className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-0.5">{sub}</div>
    </div>
    <div className="text-2xl font-black text-primary">{value}</div>
  </div>
);

const QuickLink = ({ icon: Icon, label, href }: { icon: any; label: string; href: string }) => (
  <a 
    href={href}
    className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl text-xs font-bold hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
  >
    <Icon className="w-4 h-4" />
    {label}
  </a>
);
