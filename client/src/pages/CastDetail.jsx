import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import api from '../api';
import ContentCard from '../components/content/ContentCard';
import Loader from '../components/common/Loader';

export default function CastDetail() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/cast/${id}`).then(res => setMember(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader size="lg" />;
  if (!member) return <div className="text-center py-20 text-slate-500">Cast member not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-8 md:px-16 py-8">
      <Link to="/" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 mb-6">
        <ChevronLeft size={16} /> Back
      </Link>

      <div className="flex flex-col md:flex-row gap-8 mb-10">
        <div className="w-40 h-40 bg-card rounded-full overflow-hidden flex-shrink-0 mx-auto md:mx-0">
          {member.photo_url ? (
            <img src={member.photo_url} alt={member.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900/40 to-indigo-900/40">
              <span className="text-4xl font-bold text-violet-400">{member.name?.charAt(0)}</span>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">{member.name}</h1>
          {member.known_for && <p className="text-slate-400 text-sm mb-2">Known for: {member.known_for}</p>}
          {member.birth_place && <p className="text-slate-500 text-sm mb-4">Origin: {member.birth_place}</p>}
          {member.biography && <p className="text-slate-300 leading-relaxed">{member.biography}</p>}
        </div>
      </div>

      {member.filmography?.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-4">Filmography</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {member.filmography.map((item) => (
              <div key={item.id}>
                <ContentCard content={item} />
                <p className="text-xs text-slate-500 mt-1 text-center">as {item.character_name}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
