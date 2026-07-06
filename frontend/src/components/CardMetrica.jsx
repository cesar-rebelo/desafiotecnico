export default function CardMetrica({ label, value, icon, trend, trendLabel }) {
  const positive = trend === 'up';
  return (
    <div className="bg-white/75 backdrop-blur-sm border border-white/90 rounded-2xl px-6 py-5 hover:bg-white/90 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-50 rounded-xl">{icon}</div>
        {trend && (
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
          }`}>
            {trendLabel}
          </span>
        )}
      </div>
      <p className="text-[28px] font-bold text-gray-900 leading-none mb-1.5">{value}</p>
      <p className="text-[11px] text-gray-400 font-medium leading-snug">{label}</p>
    </div>
  );
}
