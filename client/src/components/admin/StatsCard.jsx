export default function StatsCard({ label, value, icon: Icon, color }) {
  return (
    <div className="bg-card rounded-xl p-5 border border-slate-700/50">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-slate-400">{label}</span>
        {Icon && <Icon size={20} className={color} />}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
