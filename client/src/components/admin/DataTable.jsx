export default function DataTable({ columns, children }) {
  return (
    <div className="bg-card rounded-xl border border-slate-700/50 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700/50">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-xs text-slate-400 font-medium px-4 py-3 ${
                  col.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
