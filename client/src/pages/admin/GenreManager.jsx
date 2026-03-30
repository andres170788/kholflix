import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api';
import Loader from '../../components/common/Loader';

export default function GenreManager() {
  const [genres, setGenres] = useState([]);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/genres').then(res => setGenres(res.data)).finally(() => setLoading(false));
  }, []);

  const addGenre = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const res = await api.post('/admin/genres', { name: newName.trim() });
      setGenres([...genres, res.data]);
      setNewName('');
      toast.success('Genre added');
    } catch { toast.error('Failed to add genre'); }
  };

  const deleteGenre = async (id) => {
    try {
      await api.delete(`/admin/genres/${id}`);
      setGenres(genres.filter(g => g.id !== id));
      toast.success('Genre deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Genre Manager</h1>

      <form onSubmit={addGenre} className="flex gap-3 mb-8 max-w-md">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="input-field flex-1"
          placeholder="New genre name..."
        />
        <button type="submit" className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add
        </button>
      </form>

      <div className="bg-card rounded-xl border border-slate-700/50 divide-y divide-slate-700/30">
        {genres.map((genre) => (
          <div key={genre.id} className="flex items-center justify-between px-4 py-3">
            <div>
              <span className="font-medium text-sm">{genre.name}</span>
              <span className="text-xs text-slate-500 ml-2">/{genre.slug}</span>
            </div>
            <button onClick={() => deleteGenre(genre.id)} className="text-slate-400 hover:text-red-400 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
