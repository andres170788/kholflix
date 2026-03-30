import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api';
import VideoPlayer from '../components/content/VideoPlayer';
import AIBadge from '../components/content/AIBadge';
import Loader from '../components/common/Loader';

export default function EpisodePlayer() {
  const { id } = useParams();
  const [episode, setEpisode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/content/episode/${id}`)
      .then(res => setEpisode(res.data))
      .catch(() => setEpisode(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader size="lg" />;
  if (!episode) return <div className="text-center py-20 text-slate-500">Episode not found</div>;

  const currentIdx = episode.siblings?.findIndex(s => s.id === episode.id) ?? -1;
  const prevEp = currentIdx > 0 ? episode.siblings[currentIdx - 1] : null;
  const nextEp = currentIdx < (episode.siblings?.length || 0) - 1 ? episode.siblings[currentIdx + 1] : null;

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      <div className="mb-6">
        <Link to={`/series/${episode.series_slug}`} className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1">
          <ChevronLeft size={16} /> Back to {episode.series_title}
        </Link>
      </div>

      <VideoPlayer
        url={episode.video_url}
        source={episode.video_source}
        title={episode.title}
      />

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3">
          {episode.ai_model && <AIBadge model={episode.ai_model} />}
          <span className="text-xs text-slate-500">S{episode.season_number} E{episode.episode_number}</span>
          {episode.duration_minutes && <span className="text-xs text-slate-500">{episode.duration_minutes} min</span>}
        </div>
        <h1 className="text-2xl font-bold">{episode.title}</h1>
        <p className="text-slate-400 text-sm">{episode.series_title} &middot; {episode.season_title || `Season ${episode.season_number}`}</p>
        {episode.description && (
          <p className="text-slate-300 leading-relaxed">{episode.description}</p>
        )}
      </div>

      {/* Prev / Next navigation */}
      {(prevEp || nextEp) && (
        <div className="flex justify-between mt-8 pt-6 border-t border-slate-800">
          {prevEp ? (
            <Link to={`/episode/${prevEp.id}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
              <ChevronLeft size={16} />
              <div>
                <p className="text-xs text-slate-500">Previous</p>
                <p>E{prevEp.episode_number} {prevEp.title}</p>
              </div>
            </Link>
          ) : <div />}
          {nextEp ? (
            <Link to={`/episode/${nextEp.id}`} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors text-right">
              <div>
                <p className="text-xs text-slate-500">Next</p>
                <p>E{nextEp.episode_number} {nextEp.title}</p>
              </div>
              <ChevronRight size={16} />
            </Link>
          ) : <div />}
        </div>
      )}
    </div>
  );
}
