import { useState, useEffect } from 'react';
import { Shield, User } from 'lucide-react';
import api from '../../api';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import DataTable from '../../components/admin/DataTable';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Manager</h1>
      <p className="text-sm text-slate-400 mb-6">{users.length} registered users</p>

      <DataTable columns={[
        { key: 'user', label: 'User' },
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'plan', label: 'Plan' },
        { key: 'joined', label: 'Joined' },
      ]}>
        {users.map((u) => (
          <tr key={u.id} className="border-b border-slate-700/30 hover:bg-card-hover transition-colors">
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {u.display_name?.charAt(0) || u.username?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{u.display_name || u.username}</p>
                  <p className="text-xs text-slate-500">@{u.username}</p>
                </div>
              </div>
            </td>
            <td className="px-4 py-3 text-sm text-slate-400">{u.email}</td>
            <td className="px-4 py-3">
              <Badge variant={u.role === 'admin' ? 'default' : 'info'}>
                {u.role === 'admin' ? <Shield size={10} /> : <User size={10} />} {u.role}
              </Badge>
            </td>
            <td className="px-4 py-3 text-sm text-slate-400">{u.plan_name || 'Free'}</td>
            <td className="px-4 py-3 text-xs text-slate-500">{new Date(u.created_at).toLocaleDateString()}</td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
