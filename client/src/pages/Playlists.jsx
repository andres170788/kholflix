import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { ListVideo, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export default function Playlists() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (!user) return;
    api.get('/playlists').then(res => setPlaylists(res.data)).finally(() => setLoading(false));
  }, [user]);

  const createPlaylist = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/playlists', { name: newName });
      setPlaylists([res.data, ...playlists]);
      setShowCreate(false);
      setNewName('');
      toast.success('Playlist created');
    } catch { toast.error('Failed to create playlist'); }
  };

  const deletePlaylist = async (id) => {
    try {
      await api.delete(`/playlists/${id}`);
      setPlaylists(playlists.filter(p => p.id !== id));
      toast.success('Playlist deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (!user) return <Navigate to="/login" />;
  if (loading) return <Loader size="lg" />;

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-16 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Playlists</h1>
        <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Playlist
        </button>
      </div>

      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {playlists.map((pl) => (
            <div key={pl.id} className="bg-card rounded-xl p-4 hover:bg-card-hover transition-colors group">
              <Link to={`/playlists/${pl.id}`} className="block">
                <div className="flex items-center gap-3 mb-2">
                  <ListVideo size={24} className="text-violet-400" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{pl.name}</h3>
                    <p className="text-xs text-slate-500">{pl.item_count || 0} items</p>
                  </div>
                </div>
                {pl.description && <p className="text-sm text-slate-400 truncate">{pl.description}</p>}
              </Link>
              <button
                onClick={() => deletePlaylist(pl.id)}
                className="mt-3 text-xs text-red-400/50 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={ListVideo} title="No playlists yet" />
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Playlist">
        <form onSubmit={createPlaylist} className="space-y-4">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="input-field"
            placeholder="Playlist name"
            required
          />
          <button type="submit" className="btn-primary w-full">Create</button>
        </form>
      </Modal>
    </div>
  );
}
