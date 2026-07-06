export default function CardMetrica({ label, value, icon, trend, trendLabel }) {
  const positive = trend === 'up';
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-gray-50 rounded-xl">
          {icon}
        </div>
        {trend && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
            positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
          }`}>
            {positive ? '↑' : '↓'} {trendLabel}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
      <p className="text-[12px] text-gray-400 font-medium">{label}</p>
    </div>
  );
}
