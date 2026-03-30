import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import AIBadge from './AIBadge';

export default function HeroBanner({ items = [] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % items.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  const item = items[current];
  const linkTo = item.type === 'series' ? `/series/${item.slug}` : `/movie/${item.slug}`;

  return (
    <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {item.backdrop_url ? (
          <img src={item.backdrop_url} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-900/30 via-dark to-indigo-900/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/30" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center px-8 md:px-16 max-w-7xl mx-auto">
        <div className="max-w-2xl space-y-4">
          {item.ai_model && <AIBadge model={item.ai_model} />}

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            {item.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-slate-300">
            {item.release_date && (
              <span>{new Date(item.release_date).getFullYear()}</span>
            )}
            {item.duration_minutes && <span>{item.duration_minutes} min</span>}
            {item.rating_avg > 0 && (
              <span className="flex items-center gap-1 text-yellow-500">
                ★ {Number(item.rating_avg).toFixed(1)}
              </span>
            )}
            <span className="badge bg-violet-500/20 text-violet-300 uppercase text-xs">
              {item.type}
            </span>
          </div>

          {item.genres && item.genres.length > 0 && (
            <div className="flex gap-2">
              {item.genres.map((g, i) => (
                <span key={i} className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded">
                  {g}
                </span>
              ))}
            </div>
          )}

          <p className="text-slate-300 text-sm md:text-base line-clamp-3 max-w-xl">
            {item.description}
          </p>

          <div className="flex gap-3 pt-2">
            <Link to={linkTo} className="btn-primary flex items-center gap-2">
              <Play size={18} fill="white" /> Watch Now
            </Link>
            <Link to={linkTo} className="btn-secondary flex items-center gap-2">
              <Info size={18} /> More Info
            </Link>
          </div>
        </div>
      </div>

      {/* Nav arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((current - 1 + items.length) % items.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-dark/50 hover:bg-dark/80 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrent((current + 1) % items.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-dark/50 hover:bg-dark/80 transition-colors"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? 'w-6 bg-violet-500' : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
