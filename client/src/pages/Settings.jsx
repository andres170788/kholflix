import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Settings() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="max-w-2xl mx-auto px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-4">
        <div className="bg-card rounded-xl p-6">
          <h3 className="font-semibold mb-3">Account</h3>
          <div className="space-y-2 text-sm text-slate-400">
            <p>Email: {user.email}</p>
            <p>Username: {user.username}</p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-6">
          <h3 className="font-semibold mb-3">Subscription</h3>
          <p className="text-sm text-slate-400 mb-3">Manage your subscription plan</p>
          <Link to="/plans" className="btn-primary text-sm">View Plans</Link>
        </div>

        <div className="bg-card rounded-xl p-6">
          <h3 className="font-semibold mb-3">Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input type="checkbox" defaultChecked className="rounded bg-dark-lighter border-slate-600 text-violet-600 focus:ring-violet-500" />
              Email notifications
            </label>
            <label className="flex items-center gap-3 text-sm text-slate-300">
              <input type="checkbox" defaultChecked className="rounded bg-dark-lighter border-slate-600 text-violet-600 focus:ring-violet-500" />
              Autoplay next episode
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
