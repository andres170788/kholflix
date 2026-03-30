import { Check } from 'lucide-react';

export default function PlanCard({ plan, onSubscribe }) {
  const isPopular = plan.name === 'Premium';

  return (
    <div
      className={`bg-card rounded-2xl p-6 border transition-all hover:scale-[1.02] ${
        isPopular ? 'border-violet-500 ring-1 ring-violet-500/30' : 'border-slate-700'
      }`}
    >
      {isPopular && (
        <div className="text-center mb-3">
          <span className="text-xs bg-violet-600 text-white px-3 py-1 rounded-full font-medium">POPULAR</span>
        </div>
      )}
      <h3 className="text-xl font-bold text-center">{plan.name}</h3>
      <div className="text-center my-4">
        <span className="text-4xl font-extrabold">${plan.price}</span>
        {plan.price > 0 && <span className="text-slate-400 text-sm">/month</span>}
      </div>

      <ul className="space-y-2 mb-6 text-sm">
        <li className="flex items-center gap-2 text-slate-300">
          <Check size={16} className="text-green-500" /> {plan.video_quality} quality
        </li>
        <li className="flex items-center gap-2 text-slate-300">
          <Check size={16} className="text-green-500" /> {plan.max_devices} device{plan.max_devices > 1 ? 's' : ''}
        </li>
        <li className="flex items-center gap-2 text-slate-300">
          <Check size={16} className={plan.can_download ? 'text-green-500' : 'text-slate-600'} />
          <span className={!plan.can_download ? 'text-slate-600' : ''}>Downloads</span>
        </li>
      </ul>

      <button
        onClick={() => onSubscribe(plan.id)}
        className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
          isPopular
            ? 'bg-violet-600 hover:bg-violet-700 text-white'
            : 'bg-card-hover hover:bg-violet-600/20 text-slate-300 border border-slate-700'
        }`}
      >
        {plan.price === 0 ? 'Current Plan' : 'Subscribe'}
      </button>
    </div>
  );
}
