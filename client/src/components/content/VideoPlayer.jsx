import { useState } from 'react';
import { Play, Maximize, Volume2, VolumeX } from 'lucide-react';

function getEmbedUrl(url, source) {
  if (!url) return null;
  if (source === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : null;
  }
  if (source === 'vimeo' || url.includes('vimeo.com')) {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}?autoplay=1` : null;
  }
  return url;
}

export default function VideoPlayer({ url, source, poster, title }) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = getEmbedUrl(url, source);

  if (!url) {
    return (
      <div className="relative aspect-video bg-dark-lighter rounded-xl flex items-center justify-center">
        <p className="text-slate-500">No video available</p>
      </div>
    );
  }

  if (!playing) {
    return (
      <div
        className="relative aspect-video bg-dark-lighter rounded-xl overflow-hidden cursor-pointer group"
        onClick={() => setPlaying(true)}
      >
        {poster ? (
          <img src={poster} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-900/30 to-indigo-900/20" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
          <div className="bg-violet-600 rounded-full p-5 shadow-2xl shadow-violet-500/30 group-hover:scale-110 transition-transform">
            <Play size={32} fill="white" />
          </div>
        </div>
      </div>
    );
  }

  if (source === 'local') {
    return (
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
        <video
          src={url}
          controls
          autoPlay
          className="w-full h-full"
          poster={poster}
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
      <iframe
        src={embedUrl}
        className="w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={title}
      />
    </div>
  );
}
