import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Loader from './components/common/Loader';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MovieDetail from './pages/MovieDetail';
import SeriesDetail from './pages/SeriesDetail';
import EpisodePlayer from './pages/EpisodePlayer';
import Browse from './pages/Browse';
import GenreDetail from './pages/GenreDetail';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';
import Favorites from './pages/Favorites';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Plans from './pages/Plans';
import CastDetail from './pages/CastDetail';
import MakingOf from './pages/MakingOf';
import NotFound from './pages/NotFound';

// Admin
import Dashboard from './pages/admin/Dashboard';
import ContentManager from './pages/admin/ContentManager';
import ContentForm from './pages/admin/ContentForm';
import GenreManager from './pages/admin/GenreManager';
import UserManager from './pages/admin/UserManager';

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Admin routes */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/content" element={<ContentManager />} />
        <Route path="/admin/content/new" element={<ContentForm />} />
        <Route path="/admin/content/:id/edit" element={<ContentForm />} />
        <Route path="/admin/genres" element={<GenreManager />} />
        <Route path="/admin/users" element={<UserManager />} />
      </Route>

      {/* Main routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:slug" element={<MovieDetail />} />
        <Route path="/series/:slug" element={<SeriesDetail />} />
        <Route path="/episode/:id" element={<EpisodePlayer />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/genre/:slug" element={<GenreDetail />} />
        <Route path="/search" element={<Search />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/playlists/:id" element={<PlaylistDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/cast/:id" element={<CastDetail />} />
        <Route path="/making-of/:id" element={<MakingOf />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
