import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api';
import Loader from '../../components/common/Loader';

export default function ContentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(!!isEdit);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: '', type: 'movie', description: '', poster_url: '', backdrop_url: '',
    trailer_url: '', video_url: '', video_source: 'youtube', duration_minutes: '',
    release_date: '', ai_model: '', ai_prompt: '', ai_making_of: '',
    is_featured: false, status: 'draft', genres: [],
  });

  useEffect(() => {
    api.get('/admin/genres').then(res => setGenres(res.data));
    if (isEdit) {
      api.get(`/admin/content`).then(res => {
        const item = res.data.data.find(c => c.id === parseInt(id));
        if (item) {
          setForm({
            title: item.title || '',
            type: item.type || 'movie',
            description: item.description || '',
            poster_url: item.poster_url || '',
            backdrop_url: item.backdrop_url || '',
            trailer_url: item.trailer_url || '',
            video_url: item.video_url || '',
            video_source: item.video_source || 'youtube',
            duration_minutes: item.duration_minutes || '',
            release_date: item.release_date ? item.release_date.split('T')[0] : '',
            ai_model: item.ai_model || '',
            ai_prompt: item.ai_prompt || '',
            ai_making_of: item.ai_making_of || '',
            is_featured: item.is_featured || false,
            status: item.status || 'draft',
            genres: [],
          });
        }
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null,
      };
      if (isEdit) {
        await api.put(`/admin/content/${id}`, payload);
        toast.success('Content updated');
      } else {
        await api.post('/admin/content', payload);
        toast.success('Content created');
      }
      navigate('/admin/content');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    }
    setSaving(false);
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

  if (loading) return <Loader />;

  return (
    <div>
      <button onClick={() => navigate('/admin/content')} className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 mb-6">
        <ArrowLeft size={16} /> Back to Content
      </button>
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Content' : 'New Content'}</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Title *</label>
            <input type="text" value={form.title} onChange={e => update('title', e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Type</label>
            <select value={form.type} onChange={e => update('type', e.target.value)} className="input-field">
              <option value="movie">Movie</option>
              <option value="series">Series</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">Description</label>
          <textarea value={form.description} onChange={e => update('description', e.target.value)} className="input-field h-28 resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Video URL</label>
            <input type="url" value={form.video_url} onChange={e => update('video_url', e.target.value)} className="input-field" placeholder="YouTube, Vimeo, or direct URL" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Video Source</label>
            <select value={form.video_source} onChange={e => update('video_source', e.target.value)} className="input-field">
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
              <option value="local">Local Upload</option>
              <option value="external">External URL</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Poster URL</label>
            <input type="url" value={form.poster_url} onChange={e => update('poster_url', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Backdrop URL</label>
            <input type="url" value={form.backdrop_url} onChange={e => update('backdrop_url', e.target.value)} className="input-field" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Duration (min)</label>
            <input type="number" value={form.duration_minutes} onChange={e => update('duration_minutes', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Release Date</label>
            <input type="date" value={form.release_date} onChange={e => update('release_date', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm text-slate-300 mb-1">Status</label>
            <select value={form.status} onChange={e => update('status', e.target.value)} className="input-field">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">AI Model</label>
            <input type="text" value={form.ai_model} onChange={e => update('ai_model', e.target.value)} className="input-field" placeholder="Sora, Runway, Kling..." />
          </div>
          <div className="flex items-end gap-4">
            <label className="flex items-center gap-2 text-sm text-slate-300 pb-2">
              <input type="checkbox" checked={form.is_featured} onChange={e => update('is_featured', e.target.checked)}
                className="rounded bg-dark-lighter border-slate-600 text-violet-600 focus:ring-violet-500" />
              Featured
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">AI Prompt</label>
          <textarea value={form.ai_prompt} onChange={e => update('ai_prompt', e.target.value)} className="input-field h-20 resize-none" />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-1">AI Making Of</label>
          <textarea value={form.ai_making_of} onChange={e => update('ai_making_of', e.target.value)} className="input-field h-20 resize-none" />
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Genres</label>
          <div className="flex flex-wrap gap-2">
            {genres.map(g => (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  const selected = form.genres.includes(g.id)
                    ? form.genres.filter(x => x !== g.id)
                    : [...form.genres, g.id];
                  update('genres', selected);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  form.genres.includes(g.id)
                    ? 'bg-violet-600 text-white'
                    : 'bg-card text-slate-400 hover:text-white'
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
          <Save size={18} /> {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}
