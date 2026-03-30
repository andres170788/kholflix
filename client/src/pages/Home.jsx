import { useState, useEffect } from 'react';
import api from '../api';
import HeroBanner from '../components/content/HeroBanner';
import ContentCarousel from '../components/content/ContentCarousel';
import Loader from '../components/common/Loader';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [latest, setLatest] = useState([]);
  const [popular, setPopular] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/content/featured'),
      api.get('/content/trending'),
      api.get('/content/latest'),
      api.get('/content/popular'),
    ]).then(([f, t, l, p]) => {
      setFeatured(f.data);
      setTrending(t.data);
      setLatest(l.data);
      setPopular(p.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader size="lg" />;

  return (
    <div>
      <HeroBanner items={featured} />
      <div className="space-y-2 -mt-20 relative z-10">
        <ContentCarousel title="Trending Now" items={trending} />
        <ContentCarousel title="Latest Releases" items={latest} />
        <ContentCarousel title="Top Rated" items={popular} />
      </div>
    </div>
  );
}
