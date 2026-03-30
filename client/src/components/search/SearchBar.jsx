import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import api from '../../api';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (value) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (value.trim().length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(value)}&limit=5`);
        setResults(res.data.data || []);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <form onSubmit={handleSubmit} className="flex items-center">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { handleSearch(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Search movies, series..."
            className="bg-dark-lighter border border-slate-700 rounded-lg pl-9 pr-8 py-2 text-sm w-48 md:w-64 focus:w-80
                       text-slate-50 placeholder-slate-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown results */}
      {open && query.trim().length >= 2 && (
        <div className="absolute top-full mt-2 w-80 bg-dark-lighter border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden">
          {loading ? (
            <div className="p-4 text-center text-slate-500 text-sm">Searching...</div>
          ) : results.length > 0 ? (
            <>
              {results.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.type === 'series' ? `/series/${item.slug}` : `/movie/${item.slug}`);
                    setOpen(false);
                    setQuery('');
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-card transition-colors text-left"
                >
                  <div className="w-10 h-14 bg-card rounded overflow-hidden flex-shrink-0">
                    {item.poster_url ? (
                      <img src={item.poster_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-violet-400 text-xs font-bold">
                        {item.title?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{item.title}</p>
                    <p className="text-xs text-slate-500 capitalize">{item.type} {item.release_date ? `• ${new Date(item.release_date).getFullYear()}` : ''}</p>
                  </div>
                </button>
              ))}
              <button
                onClick={handleSubmit}
                className="w-full p-3 text-center text-sm text-violet-400 hover:bg-card transition-colors border-t border-slate-700"
              >
                See all results for "{query}"
              </button>
            </>
          ) : (
            <div className="p-4 text-center text-slate-500 text-sm">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
