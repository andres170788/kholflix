import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import api from '../api';
import ContentCard from '../components/content/ContentCard';
import Loader from '../components/common/Loader';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!query.trim()) return;
    setLoading(true);
    api.get(`/search?q=${encodeURIComponent(query)}&limit=50`).then(res => {
      setResults(res.data.data || []);
      setTotal(res.data.total || 0);
    }).finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-8 md:px-16 py-8">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      {query && <p className="text-slate-400 mb-8">Showing {total} results for "{query}"</p>}

      {loading ? (
        <Loader />
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map((item) => (
            <ContentCard key={item.id} content={item} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-20 text-slate-500">
          <SearchIcon size={48} className="mx-auto mb-4 opacity-50" />
          <p>No results found for "{query}"</p>
        </div>
      ) : null}
    </div>
  );
}
