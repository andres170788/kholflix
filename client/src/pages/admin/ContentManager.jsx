import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import DataTable from '../../components/admin/DataTable';

export default function ContentManager() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/content?limit=50');
      setContent(res.data.data);
      setTotal(res.data.total);
    } catch { toast.error('Failed to load content'); }
    setLoading(false);
  };

  const deleteContent = async (id) => {
    if (!confirm('Delete this content?')) return;
    try {
      await api.delete(`/admin/content/${id}`);
      setContent(content.filter(c => c.id !== id));
      toast.success('Content deleted');
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Content Manager</h1>
          <p className="text-sm text-slate-400">{total} items</p>
        </div>
        <Link to="/admin/content/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Content
        </Link>
      </div>

      <DataTable columns={[
        { key: 'title', label: 'Title' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status' },
        { key: 'ai_model', label: 'AI Model' },
        { key: 'views', label: 'Views' },
        { key: 'actions', label: 'Actions', align: 'right' },
      ]}>
        {content.map((item) => (
          <tr key={item.id} className="border-b border-slate-700/30 hover:bg-card-hover transition-colors">
            <td className="px-4 py-3">
              <p className="font-medium text-sm">{item.title}</p>
              <p className="text-xs text-slate-500">{item.slug}</p>
            </td>
            <td className="px-4 py-3">
              <Badge variant={item.type === 'movie' ? 'info' : 'default'}>{item.type}</Badge>
            </td>
            <td className="px-4 py-3">
              <Badge variant={item.status === 'published' ? 'success' : 'warning'}>{item.status}</Badge>
            </td>
            <td className="px-4 py-3 text-sm text-slate-400">{item.ai_model || '-'}</td>
            <td className="px-4 py-3 text-sm text-slate-400">{item.view_count?.toLocaleString()}</td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-2">
                <Link to={`/${item.type === 'series' ? 'series' : 'movie'}/${item.slug}`}
                  className="p-1.5 text-slate-400 hover:text-white transition-colors">
                  <Eye size={16} />
                </Link>
                <Link to={`/admin/content/${item.id}/edit`}
                  className="p-1.5 text-slate-400 hover:text-violet-400 transition-colors">
                  <Edit size={16} />
                </Link>
                <button onClick={() => deleteContent(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
