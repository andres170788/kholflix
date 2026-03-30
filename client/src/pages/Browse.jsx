import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Grid3X3, Film, Tv } from 'lucide-react';
import api from '../api';
import ContentCard from '../components/content/ContentCard';
import Loader from '../components/common/Loader';

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const type = searchParams.get('type') || '';
  const sort = searchParams.get('sort') || 'latest';

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/content?type=${type}&sort=${sort}&limit=50`),
      api.get('/genres'),
    ]).then(([c, g]) => {
      setContent(c.data.data || []);
      setGenres(g.data);
    }).finally(() => setLoading(false));
  }, [type, sort]);

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-16 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {type === 'movie' ? 'Movies' : type === 'series' ? 'Series' : 'Browse All'}
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex bg-card rounded-lg p-1">
          {[
            { value: '', label: 'All', icon: Grid3X3 },
            { value: 'movie', label: 'Movies', icon: Film },
            { value: 'series', label: 'Series', icon: Tv },
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => { searchParams.set('type', value); if (!value) searchParams.delete('type'); setSearchParams(searchParams); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm transition-colors ${
                type === value ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => { searchParams.set('sort', e.target.value); setSearchParams(searchParams); }}
          className="bg-card border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300"
        >
          <option value="latest">Latest</option>
          <option value="popular">Most Popular</option>
          <option value="rating">Top Rated</option>
          <option value="title">A-Z</option>
        </select>
      </div>

      {/* Genres Row */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6" style={{ scrollbarWidth: 'none' }}>
        {genres.map((genre) => (
          <Link
            key={genre.id}
            to={`/genre/${genre.slug}`}
            className="flex-shrink-0 px-4 py-2 bg-card hover:bg-card-hover rounded-lg text-sm text-slate-300 hover:text-violet-400 transition-colors border border-slate-700/50"
          >
            {genre.name}
            {genre.content_count > 0 && <span className="text-xs text-slate-500 ml-1.5">({genre.content_count})</span>}
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      {loading ? (
        <Loader />
      ) : content.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {content.map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-500">
          <Film size={48} className="mx-auto mb-4 opacity-50" />
          <p>No content found</p>
        </div>
      )}
    </div>
  );
}
