import { Link } from 'react-router-dom';
import { Play, Star, Clock } from 'lucide-react';
import AIBadge from './AIBadge';

export default function ContentCard({ content }) {
  const linkTo = content.type === 'series'
    ? `/series/${content.slug}`
    : `/movie/${content.slug}`;

  return (
    <Link to={linkTo} className="card group block">
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-dark-lighter overflow-hidden">
        {content.poster_url ? (
          <img
            src={content.poster_url}
            alt={content.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900/40 to-indigo-900/40">
            <span className="text-4xl font-bold text-violet-400/60">
              {content.title?.charAt(0)}
            </span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <div className="bg-violet-600 rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Play size={20} fill="white" />
          </div>
        </div>

        {/* AI Badge */}
        {content.ai_model && (
          <div className="absolute top-2 left-2">
            <AIBadge model={content.ai_model} />
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-2 right-2">
          <span className="badge bg-dark/80 text-slate-300 backdrop-blur-sm text-[10px] uppercase tracking-wider">
            {content.type}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-slate-100 truncate group-hover:text-violet-400 transition-colors">
          {content.title}
        </h3>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
          {content.rating_avg > 0 && (
            <span className="flex items-center gap-1">
              <Star size={12} className="text-yellow-500 fill-yellow-500" />
              {Number(content.rating_avg).toFixed(1)}
            </span>
          )}
          {content.duration_minutes && (
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {content.duration_minutes}m
            </span>
          )}
          {content.release_date && (
            <span>{new Date(content.release_date).getFullYear()}</span>
          )}
        </div>
        {content.genres && content.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {content.genres.slice(0, 2).map((g, i) => (
              <span key={i} className="text-[10px] text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded">
                {g}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
