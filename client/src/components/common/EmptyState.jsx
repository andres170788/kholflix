export default function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="text-center py-20 text-slate-500">
      {Icon && <Icon size={48} className="mx-auto mb-4 opacity-50" />}
      <p>{title}</p>
      {subtitle && <p className="text-sm mt-1">{subtitle}</p>}
    </div>
  );
}
