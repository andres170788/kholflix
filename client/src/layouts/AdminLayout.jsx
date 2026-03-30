import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { BarChart3, Film, Tags, Users, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const links = [
  { to: '/admin', label: 'Dashboard', icon: BarChart3 },
  { to: '/admin/content', label: 'Content', icon: Film },
  { to: '/admin/genres', label: 'Genres', icon: Tags },
  { to: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 bg-dark-lighter border-r border-slate-800 fixed h-full pt-16 z-40">
        <div className="p-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to site
          </Link>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Admin Panel</h2>
          <nav className="space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  location.pathname === to
                    ? 'bg-violet-500/10 text-violet-400'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} /> {label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 ml-60 pt-16">
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
