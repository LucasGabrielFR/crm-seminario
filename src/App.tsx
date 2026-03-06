import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './features/auth/LoginPage';
import { Layout } from './components/Layout';
import { PeoplePage } from './features/users/PeoplePage';
import { LibraryPage } from './features/library/LibraryPage';
import { AcademicPage } from './features/academic/AcademicPage';

// Placeholder for Dashboard
const Dashboard = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground font-medium mt-1">Bem-vindo ao Vocare CRM</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-card p-8 rounded-2xl shadow-xl shadow-primary/5 border border-border group hover:border-primary/50 transition-all duration-300">
        <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Seminaristas Ativos</h3>
        <p className="text-4xl font-black mt-3 text-foreground group-hover:text-primary transition-colors">0</p>
        <div className="mt-4 w-full h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-0 transition-all duration-1000"></div>
        </div>
      </div>
      <div className="bg-card p-8 rounded-2xl shadow-xl shadow-primary/5 border border-border group hover:border-primary/50 transition-all duration-300">
        <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Livros Emprestados</h3>
        <p className="text-4xl font-black mt-3 text-foreground group-hover:text-primary transition-colors">0</p>
        <div className="mt-4 w-full h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary w-0 transition-all duration-1000"></div>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  const { session, profile, loading } = useAuth();
  const isAdminOrFormador = profile?.role === 'admin' || profile?.role === 'formador';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!session ? <LoginPage /> : <Navigate to="/" />} 
        />
        
        <Route 
          path="/" 
          element={
            session ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        <Route 
          path="/users" 
          element={
            session ? (
              isAdminOrFormador ? (
                <Layout>
                  <PeoplePage />
                </Layout>
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        <Route 
          path="/library" 
          element={
            session ? (
              <Layout>
                <LibraryPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        <Route 
          path="/academic" 
          element={
            session ? (
              <Layout>
                <AcademicPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          } 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
