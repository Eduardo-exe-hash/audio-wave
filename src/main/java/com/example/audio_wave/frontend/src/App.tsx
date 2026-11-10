import { useState } from 'react';
import {BrowserRouter,Routes,Route,Navigate,useLocation,useNavigate,} from 'react-router-dom';
import type { Track } from './types/track';
import { api } from './services/api';
import { Login } from './pages/Login';
import { Register } from './components/Register';
import { Home } from './pages/Home';
import { Favorites } from './pages/Favorites';
import { Search } from './pages/Search';
import { Playlists } from './pages/Playlists';
import { Recommendations } from './pages/Recommendations';
import { PlaylistDetails } from './pages/PlaylistDetails';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';
import { Navbar } from './components/Navbar';
import { Player } from './components/Player';

// Protege as rotas que exigem autenticação.
const PrivateRoute = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const token = localStorage.getItem('token');

  return token
    ? <>{children}</>
    : <Navigate to="/login" replace />;
};

// Controla o layout de acordo com a página atual.
function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Verifica se está em uma página de autenticação.
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register';

  const isSearchPage = location.pathname === '/search';

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const isAuthenticated = !!localStorage.getItem('token');

  // Realiza o logout.
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao realizar logout:', error);
    } finally {
      localStorage.removeItem('token');
      setCurrentTrack(null);
      navigate('/login', { replace: true });
    }
  };

  // Redireciona após o login.
  const handleLoginSuccess = () => {
    navigate('/home', { replace: true });
  };

  // Controla a música selecionada.
  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
  };

  return (
    <div
      className={
        isAuthPage
          ? 'min-h-screen w-full bg-[#090B10] text-white'
          : 'min-h-screen bg-gray-900 text-white flex flex-col'
      }
    >

      {/* Navbar: somente nas páginas internas */}
      {!isAuthPage && <Navbar />}

      {/* Conteúdo principal */}
      <main
        className={
          isAuthPage
            ? 'w-full'
            : isSearchPage
              ? 'mb-20 w-full flex-1 px-4 py-6'
              : 'mb-20 w-full max-w-7xl mx-auto flex-1 px-4 py-6'
        }
      >

        <Routes>

          {/* Redirecionamento da página inicial */}
          <Route
            path="/"
            element={
              <Navigate
                to={isAuthenticated ? '/home' : '/login'}
                replace
              />
            }
          />

          {/* Rotas públicas */}
          <Route
            path="/login"
            element={
              isAuthenticated
                ? <Navigate to="/home" replace />
                : <Login onLoginSuccess={handleLoginSuccess} />
            }
          />

          <Route
            path="/register"
            element={
              isAuthenticated
                ? <Navigate to="/home" replace />
                : <Register />
            }
          />

          {/* Rotas protegidas */}
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home
                  onPlayTrack={handlePlayTrack}
                  onLogout={handleLogout}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/recommendations"
            element={
              <PrivateRoute>
                <Recommendations
                  onPlayTrack={handlePlayTrack}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/search"
            element={
              <PrivateRoute>
                <Search
                  onPlayTrack={handlePlayTrack}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <PrivateRoute>
                <Favorites
                  onPlayTrack={handlePlayTrack}
                />
              </PrivateRoute>
            }
          />

          <Route
            path="/playlists"
            element={
              <PrivateRoute>
                <Playlists />
              </PrivateRoute>
            }
          />

          <Route
            path="/playlists/:id"
            element={
              <PrivateRoute>
                <PlaylistDetails
                  onPlayTrack={handlePlayTrack}
                />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />

          {/* Página não encontrada */}
          <Route
            path="*"
            element={<NotFound />}
          />

        </Routes>

      </main>

      {/* Player: somente nas páginas internas */}
      {!isAuthPage && (
        <Player currentTrack={currentTrack} />
      )}

    </div>
  );
}

// Componente principal da aplicação.
export function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
