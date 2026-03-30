import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import ContentCard from '../components/content/ContentCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export default function Watchlist() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get('/user/watchlist').then(res => setItems(res.data)).finally(() => setLoading(false));
  }, [user]);

  if (!user) return <Navigate to="/login" />;
  if (loading) return <Loader size="lg" />;

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-16 py-8">
      <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
      {items.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => <ContentCard key={item.id} content={item} />)}
        </div>
      ) : (
        <EmptyState icon={Bookmark} title="Your watchlist is empty" subtitle="Browse content and add items to your watchlist" />
      )}
    </div>
  );
}
