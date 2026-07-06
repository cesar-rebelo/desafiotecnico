export default function PainelComunicados({ announcements }) {
  return (
    <div className="bg-[#1e293b]/30 border border-slate-800 p-6 rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-md font-bold">Comunicação Oficial</h3>
        <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-semibold">
          {announcements.length} Novos
        </span>
      </div>
      <div className="space-y-3">
        {announcements.map((ann) => (
          <div key={ann.id} className="p-3 bg-slate-900/40 border border-slate-800 rounded-xl space-y-1 hover:border-indigo-500/30 transition-all cursor-pointer">
            <h4 className="text-sm font-semibold text-slate-100">{ann.title}</h4>
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>JE Portugal Oficial</span>
              <span>{ann.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
