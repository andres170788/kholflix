import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Bookmark, Heart, Star, Clock, Calendar, Sparkles, BookmarkCheck, HeartOff } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import VideoPlayer from '../components/content/VideoPlayer';
import ContentCarousel from '../components/content/ContentCarousel';
import AIBadge from '../components/content/AIBadge';
import Loader from '../components/common/Loader';

export default function MovieDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [content, setContent] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  useEffect(() => {
    setLoading(true);
    api.get(`/content/${slug}`).then(res => {
      setContent(res.data);
      setRating(res.data.userRating?.score || 0);
      setReview(res.data.userRating?.review_text || '');
      return api.get(`/content/${res.data.id}/recommendations`);
    }).then(res => {
      setRecommendations(res.data);
    }).catch(() => {
      toast.error('Failed to load content');
    }).finally(() => setLoading(false));
  }, [slug]);

  const toggleWatchlist = async () => {
    if (!user) return toast.error('Please sign in');
    try {
      if (content.inWatchlist) {
        await api.delete(`/user/watchlist/${content.id}`);
        setContent({ ...content, inWatchlist: false });
        toast.success('Removed from watchlist');
      } else {
        await api.post('/user/watchlist', { content_id: content.id });
        setContent({ ...content, inWatchlist: true });
        toast.success('Added to watchlist');
      }
    } catch { toast.error('Action failed'); }
  };

  const toggleFavorite = async () => {
    if (!user) return toast.error('Please sign in');
    try {
      if (content.inFavorites) {
        await api.delete(`/user/favorites/${content.id}`);
        setContent({ ...content, inFavorites: false });
        toast.success('Removed from favorites');
      } else {
        await api.post('/user/favorites', { content_id: content.id });
        setContent({ ...content, inFavorites: true });
        toast.success('Added to favorites');
      }
    } catch { toast.error('Action failed'); }
  };

  const submitRating = async () => {
    if (!user) return toast.error('Please sign in');
    try {
      await api.post('/ratings', { content_id: content.id, score: rating, review_text: review });
      toast.success('Rating saved');
    } catch { toast.error('Rating failed'); }
  };

  if (loading) return <Loader size="lg" />;
  if (!content) return <div className="text-center py-20 text-slate-500">Content not found</div>;

  return (
    <div>
      {/* Backdrop */}
      <div className="relative h-[50vh] overflow-hidden">
        {content.backdrop_url ? (
          <img src={content.backdrop_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-900/30 via-dark to-indigo-900/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-8 md:px-16 -mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0 w-48 md:w-64">
            <div className="aspect-[2/3] bg-card rounded-xl overflow-hidden shadow-2xl">
              {content.poster_url ? (
                <img src={content.poster_url} alt={content.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900/40 to-indigo-900/40">
                  <span className="text-6xl font-bold text-violet-400/60">{content.title?.charAt(0)}</span>
                </div>
              )}
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
              {content.duration_minutes && (
                <span className="flex items-center gap-1"><Clock size={14} /> {content.duration_minutes} min</span>
              )}
              {content.rating_avg > 0 && (
                <span className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} className="fill-yellow-500" /> {Number(content.rating_avg).toFixed(1)}
                </span>
              )}
              <span className="text-slate-500">{content.view_count?.toLocaleString()} views</span>
            </div>

            {content.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {content.genres.map((g, i) => (
                  <span key={i} className="text-xs bg-violet-500/10 text-violet-400 px-3 py-1 rounded-full">{g}</span>
                ))}
              </div>
            )}

            <p className="text-slate-300 leading-relaxed max-w-3xl">{content.description}</p>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button onClick={toggleWatchlist} className={`btn-secondary flex items-center gap-2 ${content.inWatchlist ? 'text-violet-400 border-violet-500/50' : ''}`}>
                {content.inWatchlist ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                {content.inWatchlist ? 'In Watchlist' : 'Watchlist'}
              </button>
              <button onClick={toggleFavorite} className={`btn-secondary flex items-center gap-2 ${content.inFavorites ? 'text-red-400 border-red-500/50' : ''}`}>
                <Heart size={18} className={content.inFavorites ? 'fill-red-400' : ''} />
                {content.inFavorites ? 'Favorited' : 'Favorite'}
              </button>
            </div>
          </div>
        </div>

        {/* Video Player */}
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Watch</h2>
          <VideoPlayer url={content.video_url} source={content.video_source} poster={content.backdrop_url} title={content.title} />
        </div>

        {/* Cast */}
        {content.cast?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">Cast</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {content.cast.map((member) => (
                <Link key={member.id} to={`/cast/${member.id}`} className="flex-shrink-0 w-32 text-center group">
                  <div className="w-20 h-20 mx-auto rounded-full bg-card overflow-hidden mb-2 group-hover:ring-2 ring-violet-500 transition-all">
                    {member.photo_url ? (
                      <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-violet-400 text-lg font-bold">
                        {member.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-medium text-slate-200 truncate">{member.name}</p>
                  <p className="text-xs text-slate-500 truncate">{member.character_name}</p>
                </Link>
              ))}
            </div>
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
            {content.ai_model && (
              <p className="mt-3 text-sm text-slate-500">Generated with: <span className="text-violet-400">{content.ai_model}</span></p>
            )}
          </div>
        )}

        {/* Rating */}
        {user && (
          <div className="mt-10 bg-card rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Rate this {content.type}</h2>
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)}
                  className={`text-2xl transition-colors ${s <= rating ? 'text-yellow-500' : 'text-slate-600 hover:text-slate-400'}`}>
                  ★
                </button>
              ))}
              <span className="text-sm text-slate-400 ml-2">{rating}/5</span>
            </div>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="input-field h-24 resize-none mb-3"
              placeholder="Write a review (optional)..."
            />
            <button onClick={submitRating} disabled={!rating} className="btn-primary">Submit Rating</button>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <ContentCarousel title="You Might Also Like" items={recommendations} />
        )}
      </div>
    </div>
  );
}
