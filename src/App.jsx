import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.js';
import LoadingState from './components/LoadingState.jsx';
import Layout from './components/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import GamesPage from './pages/Games.jsx';
import AvailableGamesPage from './pages/AvailableGames.jsx';
import CreateGamePage from './pages/CreateGame.jsx';
import Login from './pages/Login.jsx';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-accent-50">
        <LoadingState />
      </div>
    );
  }

  return (
    <>
      <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/"
        element={
          user ? (
            <Layout>
              <Dashboard />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/games"
        element={user ? <GamesPage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/games/available"
        element={
          user ? (
            <Layout>
              <AvailableGamesPage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/games/create"
        element={
          user ? (
            <Layout>
              <CreateGamePage />
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="*"
        element={<Navigate to={user ? '/' : '/login'} replace />}
      />
    </Routes>
    </>
  );
};

export default App;
