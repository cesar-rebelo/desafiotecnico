export default function CardMetrica({ label, value, icon, color }) {
  return (
    <div className={`p-5 rounded-2xl bg-[#1e293b]/40 border ${color} backdrop-blur-sm transition-all hover:scale-[1.02] shadow-lg`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">{value}</span>
    </div>
  );
}
