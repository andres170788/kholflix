import { useState, useEffect } from 'react';
import { Film, Users, Eye, Tv } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api';
import Loader from '../../components/common/Loader';
import StatsCard from '../../components/admin/StatsCard';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="lg" />;

  const statCards = [
    { label: 'Total Content', value: stats?.totalContent || 0, icon: Film, color: 'text-violet-400' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-400' },
    { label: 'Total Views', value: (stats?.totalViews || 0).toLocaleString(), icon: Eye, color: 'text-green-400' },
    { label: 'Movies / Series', value: `${stats?.totalMovies || 0} / ${stats?.totalSeries || 0}`, icon: Tv, color: 'text-orange-400' },
  ];

  const chartData = (stats?.topContent || []).map(c => ({
    name: c.title?.length > 15 ? c.title.slice(0, 15) + '...' : c.title,
    views: c.view_count,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <StatsCard key={card.label} {...card} />
        ))}
      </div>

      {/* Top Content Chart */}
      {chartData.length > 0 && (
        <div className="bg-card rounded-xl p-6 border border-slate-700/50 mb-8">
          <h2 className="text-lg font-semibold mb-4">Top Content by Views</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e1e2e', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#f8fafc' }}
              />
              <Bar dataKey="views" fill="#7c3aed" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Content */}
      <div className="bg-card rounded-xl p-6 border border-slate-700/50">
        <h2 className="text-lg font-semibold mb-4">Recent Content</h2>
        <div className="space-y-3">
          {(stats?.recentContent || []).map(item => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
              <div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-slate-500 capitalize">{item.type} &bull; {item.status}</p>
              </div>
              <span className="text-xs text-slate-500">{item.view_count} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
