import { Sparkles } from 'lucide-react';

const modelColors = {
  'Sora': 'from-green-500 to-emerald-600',
  'Runway Gen-3': 'from-blue-500 to-cyan-600',
  'Kling AI': 'from-orange-500 to-red-600',
  'Multiple': 'from-violet-500 to-indigo-600',
};

export default function AIBadge({ model, showLabel = true }) {
  const gradient = modelColors[model] || 'from-violet-500 to-indigo-600';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white bg-gradient-to-r ${gradient} shadow-lg`}>
      <Sparkles size={10} />
      {showLabel && <span>AI: {model}</span>}
    </span>
  );
}
