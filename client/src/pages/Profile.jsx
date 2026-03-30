import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import ProfileCard from '../components/user/ProfileCard';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get('/user/profile').then(res => {
      setProfile(res.data);
      setDisplayName(res.data.display_name || '');
    }).finally(() => setLoading(false));
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/user/profile', { display_name: displayName, avatar_url: profile.avatar_url });
      toast.success('Profile updated');
    } catch { toast.error('Update failed'); }
    setSaving(false);
  };

  if (!user) return <Navigate to="/login" />;
  if (loading) return <Loader size="lg" />;

  return (
    <div className="max-w-2xl mx-auto px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <div className="mb-6">
        <ProfileCard profile={profile} />
      </div>

      <div className="bg-card rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="input-field"
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
