import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bookmark, Heart, Star, Calendar, Sparkles, BookmarkCheck, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import AIBadge from '../components/content/AIBadge';
import ContentCarousel from '../components/content/ContentCarousel';
import Loader from '../components/common/Loader';

export default function SeriesDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [content, setContent] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [activeSeason, setActiveSeason] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/content/${slug}`),
      api.get(`/content/${slug}/episodes`),
    ]).then(([c, e]) => {
      setContent(c.data);
      setSeasons(e.data);
      return api.get(`/content/${c.data.id}/recommendations`);
    }).then(res => {
      setRecommendations(res.data);
    }).catch(() => {
      toast.error('Failed to load series');
    }).finally(() => setLoading(false));
  }, [slug]);

  const toggleWatchlist = async () => {
    if (!user) return toast.error('Please sign in');
    try {
      if (content.inWatchlist) {
        await api.delete(`/user/watchlist/${content.id}`);
        setContent({ ...content, inWatchlist: false });
      } else {
        await api.post('/user/watchlist', { content_id: content.id });
        setContent({ ...content, inWatchlist: true });
      }
    } catch { toast.error('Action failed'); }
  };

  const toggleFavorite = async () => {
    if (!user) return toast.error('Please sign in');
    try {
      if (content.inFavorites) {
        await api.delete(`/user/favorites/${content.id}`);
        setContent({ ...content, inFavorites: false });
      } else {
        await api.post('/user/favorites', { content_id: content.id });
        setContent({ ...content, inFavorites: true });
      }
    } catch { toast.error('Action failed'); }
  };

  if (loading) return <Loader size="lg" />;
  if (!content) return <div className="text-center py-20 text-slate-500">Series not found</div>;

  const currentSeason = seasons[activeSeason];

  return (
    <div>
      {/* Backdrop */}
      <div className="relative h-[50vh] overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-violet-900/30 via-dark to-indigo-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-8 md:px-16 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-48 md:w-64">
            <div className="aspect-[2/3] bg-card rounded-xl overflow-hidden shadow-2xl">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900/40 to-indigo-900/40">
                <span className="text-6xl font-bold text-violet-400/60">{content.title?.charAt(0)}</span>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            {content.ai_model && <AIBadge model={content.ai_model} />}
            <h1 className="text-3xl md:text-4xl font-extrabold">{content.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              {content.release_date && (
                <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(content.release_date).getFullYear()}</span>
              )}
              <span>{seasons.length} Season{seasons.length !== 1 ? 's' : ''}</span>
              {content.rating_avg > 0 && (
                <span className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} className="fill-yellow-500" /> {Number(content.rating_avg).toFixed(1)}
                </span>
              )}
            </div>

            {content.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {content.genres.map((g, i) => (
                  <span key={i} className="text-xs bg-violet-500/10 text-violet-400 px-3 py-1 rounded-full">{g}</span>
                ))}
              </div>
            )}

            <p className="text-slate-300 leading-relaxed max-w-3xl">{content.description}</p>

            <div className="flex gap-3 pt-2">
              <button onClick={toggleWatchlist} className={`btn-secondary flex items-center gap-2 ${content.inWatchlist ? 'text-violet-400 border-violet-500/50' : ''}`}>
                {content.inWatchlist ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                {content.inWatchlist ? 'In Watchlist' : 'Watchlist'}
              </button>
              <button onClick={toggleFavorite} className={`btn-secondary flex items-center gap-2 ${content.inFavorites ? 'text-red-400 border-red-500/50' : ''}`}>
                <Heart size={18} className={content.inFavorites ? 'fill-red-400' : ''} />
                Favorite
              </button>
            </div>
          </div>
        </div>

        {/* Seasons & Episodes */}
        {seasons.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl font-bold">Episodes</h2>
              <div className="flex gap-2">
                {seasons.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setActiveSeason(i)}
                    className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                      i === activeSeason ? 'bg-violet-600 text-white' : 'bg-card text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.title || `Season ${s.season_number}`}
                  </button>
                ))}
              </div>
            </div>

            {currentSeason?.episodes?.map((ep) => (
              <Link
                key={ep.id}
                to={`/episode/${ep.id}`}
                className="flex items-center gap-4 p-4 bg-card rounded-xl mb-3 hover:bg-card-hover transition-colors group"
              >
                <div className="w-12 h-12 bg-dark-lighter rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-violet-600 transition-colors">
                  <Play size={18} className="text-slate-400 group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    <span className="text-slate-500 mr-2">E{ep.episode_number}</span>
                    {ep.title}
                  </p>
                  {ep.description && (
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{ep.description}</p>
                  )}
                </div>
                <div className="text-xs text-slate-500 flex-shrink-0">
                  {ep.duration_minutes && `${ep.duration_minutes} min`}
                </div>
                {ep.ai_model && (
                  <AIBadge model={ep.ai_model} showLabel={false} />
                )}
              </Link>
            ))}
          </div>
        )}

        {/* AI Making Of */}
        {content.ai_making_of && (
          <div className="mt-10 bg-card rounded-xl p-6 border border-violet-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={20} className="text-violet-400" />
              <h2 className="text-xl font-bold">AI Making Of</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">{content.ai_making_of}</p>
          </div>
        )}

        {recommendations.length > 0 && (
          <ContentCarousel title="Similar Series" items={recommendations} />
        )}
      </div>
    </div>
  );
}
