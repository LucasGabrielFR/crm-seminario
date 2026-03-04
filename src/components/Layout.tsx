import React, { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Users, 
  LayoutDashboard, 
  LogOut,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../hooks/useTheme';
import packageJson from '../../package.json';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Pessoas', path: '/users', icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-card border-b border-border p-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-xl font-bold text-primary tracking-tight">Vocare CRM</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {theme === 'light' ? <Moon className="w-5 h-5 text-gray-600" /> : <Sun className="w-5 h-5 text-yellow-500" />}
          </button>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:block
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          <h1 className="hidden md:block text-2xl font-bold text-primary mb-10 px-2 tracking-tight">Vocare CRM</h1>
          
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200
                  ${isActive(item.path) 
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
                `}
              >
                <item.icon className={`w-5 h-5 mr-3 ${isActive(item.path) ? 'text-current' : 'text-primary'}`} />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-2 pt-6 border-t border-border">
            <button
              onClick={toggleTheme}
              className="w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
            >
              {theme === 'light' ? (
                <><Moon className="w-5 h-5 mr-3 text-primary" /> Modo Escuro</>
              ) : (
                <><Sun className="w-5 h-5 mr-3 text-primary" /> Modo Claro</>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </button>
            <div className="px-4 pt-4 text-center">
              <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">
                v{packageJson.version}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background/50 dark:bg-background pb-20 md:pb-0">
        <div className="p-4 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-lg border-t border-border flex justify-around p-3 z-40">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center p-2 rounded-xl transition-colors ${isActive(item.path) ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] mt-1 font-bold">{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
