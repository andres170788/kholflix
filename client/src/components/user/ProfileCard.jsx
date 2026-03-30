import { Mail, Shield, Crown } from 'lucide-react';

export default function ProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <div className="bg-card rounded-xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-violet-600 rounded-full flex items-center justify-center text-2xl font-bold">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
          ) : (
            profile.display_name?.charAt(0) || 'U'
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{profile.display_name}</h2>
          <p className="text-sm text-slate-400">@{profile.username}</p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <Mail size={16} /> {profile.email}
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Shield size={16} /> Role: <span className="capitalize text-violet-400">{profile.role}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Crown size={16} /> Plan: <span className="text-violet-400">{profile.plan_name || 'Free'}</span>
        </div>
      </div>
    </div>
  );
}
