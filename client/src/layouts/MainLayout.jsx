import { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Film, Tv, Grid3X3, Bookmark, Heart, ListVideo, User,
  LogOut, Shield, Menu, X, ChevronDown,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import SearchBar from '../components/search/SearchBar';

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setUserMenu(false);
    setMobileMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/browse?type=movie', label: 'Movies', icon: Film },
    { to: '/browse?type=series', label: 'Series', icon: Tv },
    { to: '/browse', label: 'Browse', icon: Grid3X3 },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname + location.search === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-slate-800">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-extrabold text-sm">K</span>
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">KHOLFLIX</span>
            </Link>

            {/* Nav links (desktop) */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive(to) ? 'text-violet-400 bg-violet-500/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <SearchBar />

              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="w-7 h-7 bg-violet-600 rounded-full flex items-center justify-center text-xs font-bold">
                      {user.display_name?.charAt(0) || user.username?.charAt(0)}
                    </div>
                    <ChevronDown size={14} className="text-slate-400 hidden md:block" />
                  </button>

                  {userMenu && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-dark-lighter border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                      <div className="p-3 border-b border-slate-700">
                        <p className="font-medium text-sm">{user.display_name || user.username}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/watchlist" onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-card transition-colors">
                          <Bookmark size={16} /> Watchlist
                        </Link>
                        <Link to="/favorites" onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-card transition-colors">
                          <Heart size={16} /> Favorites
                        </Link>
                        <Link to="/playlists" onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-card transition-colors">
                          <ListVideo size={16} /> Playlists
                        </Link>
                        <Link to="/profile" onClick={() => setUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-card transition-colors">
                          <User size={16} /> Profile
                        </Link>
                        {user.role === 'admin' && (
                          <Link to="/admin" onClick={() => setUserMenu(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-violet-400 hover:bg-card transition-colors">
                            <Shield size={16} /> Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-slate-700 py-1">
                        <button
                          onClick={() => { setUserMenu(false); handleLogout(); }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-card transition-colors w-full"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
                  <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 text-slate-400 hover:text-white"
                onClick={() => setMobileMenu(!mobileMenu)}
              >
                {mobileMenu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenu && (
          <div className="md:hidden border-t border-slate-800 bg-dark-lighter">
            <div className="py-2 px-4">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center gap-2 px-3 py-3 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  <Icon size={16} /> {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-dark-lighter border-t border-slate-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-600 to-indigo-600 rounded flex items-center justify-center">
              <span className="text-white font-extrabold text-xs">K</span>
            </div>
            <span className="font-bold gradient-text">KHOLFLIX</span>
          </div>
          <p className="text-slate-500 text-sm">
            AI-Generated Movies & Series Streaming Platform
          </p>
          <p className="text-slate-600 text-xs mt-2">
            &copy; {new Date().getFullYear()} KHOLCORP. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
