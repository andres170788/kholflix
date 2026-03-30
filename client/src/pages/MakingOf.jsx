import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Sparkles, Cpu, MessageSquare } from 'lucide-react';
import api from '../api';
import Loader from '../components/common/Loader';

export default function MakingOf() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/content/${id}/making-of`).then(res => setData(res.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader size="lg" />;
  if (!data) return <div className="text-center py-20 text-slate-500">Not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      <Link to="/" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 mb-6">
        <ChevronLeft size={16} /> Back
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <Sparkles size={28} className="text-violet-400" />
        <h1 className="text-3xl font-bold">Making of: {data.title}</h1>
      </div>

      <div className="space-y-6">
        {data.ai_model && (
          <div className="bg-card rounded-xl p-6 border border-violet-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={20} className="text-violet-400" />
              <h2 className="text-lg font-semibold">AI Model</h2>
            </div>
            <p className="text-2xl font-bold text-violet-400">{data.ai_model}</p>
          </div>
        )}

        {data.ai_prompt && (
          <div className="bg-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={20} className="text-violet-400" />
              <h2 className="text-lg font-semibold">Original Prompt</h2>
            </div>
            <p className="text-slate-300 bg-dark-lighter p-4 rounded-lg font-mono text-sm">{data.ai_prompt}</p>
          </div>
        )}

        {data.ai_making_of && (
          <div className="bg-card rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3">Behind the Scenes</h2>
            <p className="text-slate-300 leading-relaxed">{data.ai_making_of}</p>
          </div>
        )}
      </div>
    </div>
  );
}
