import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { ChevronLeft, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import ContentCard from '../components/content/ContentCard';
import Loader from '../components/common/Loader';

export default function PlaylistDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get(`/playlists/${id}`).then(res => setPlaylist(res.data)).finally(() => setLoading(false));
  }, [id, user]);

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/playlists/${id}/items/${itemId}`);
      setPlaylist({
        ...playlist,
        items: playlist.items.filter(i => i.item_id !== itemId),
      });
      toast.success('Item removed');
    } catch { toast.error('Failed to remove'); }
  };

  if (!user) return <Navigate to="/login" />;
  if (loading) return <Loader size="lg" />;
  if (!playlist) return <div className="text-center py-20 text-slate-500">Playlist not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-16 py-8">
      <Link to="/playlists" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 mb-6">
        <ChevronLeft size={16} /> Back to Playlists
      </Link>
      <h1 className="text-3xl font-bold mb-2">{playlist.name}</h1>
      {playlist.description && <p className="text-slate-400 mb-8">{playlist.description}</p>}

      {playlist.items?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playlist.items.map((item) => (
            <div key={item.item_id} className="relative group">
              <ContentCard content={item} />
              <button
                onClick={() => removeItem(item.item_id)}
                className="absolute top-2 right-2 z-10 p-1.5 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-20 text-slate-500">This playlist is empty</p>
      )}
    </div>
  );
}
