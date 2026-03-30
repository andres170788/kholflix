import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import ContentCard from '../components/content/ContentCard';
import Loader from '../components/common/Loader';

export default function GenreDetail() {
  const { slug } = useParams();
  const [genre, setGenre] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/genres/${slug}`).then(res => {
      setGenre(res.data.genre);
      setContent(res.data.data || []);
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Loader size="lg" />;

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-16 py-8">
      <h1 className="text-3xl font-bold mb-2">{genre?.name || 'Genre'}</h1>
      <p className="text-slate-400 mb-8">{content.length} titles</p>

      {content.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {content.map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      ) : (
        <p className="text-center py-20 text-slate-500">No content in this genre yet</p>
      )}
    </div>
  );
}
