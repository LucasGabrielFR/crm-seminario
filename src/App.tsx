import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './features/auth/LoginPage';
import { Layout } from './components/Layout';
import { PeoplePage } from './features/users/PeoplePage';
import { LibraryPage } from './features/library/LibraryPage';
import { AcademicPage } from './features/academic/AcademicPage';
import { ScalesPage } from './features/scales/ScalesPage';

import { Dashboard } from './features/dashboard/Dashboard';

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

        <Route 
          path="/scales" 
          element={
            session ? (
              <Layout>
                <ScalesPage />
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
