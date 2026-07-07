export default function PainelComunicados({ announcements, readIds = [] }) {
  const unreadCount = announcements.filter(ann => !readIds.includes(ann.id)).length;
  return (
    <div className="bg-white/50 backdrop-blur-sm border border-gray-200/50 p-6 rounded-2xl shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-[14px] font-bold text-gray-800">Comunicação Oficial</h3>
        <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full font-bold">
          {unreadCount} Novos
        </span>
      </div>
      <div className="space-y-3">
        {announcements.slice(0, 3).map((ann) => {
          const isRead = readIds.includes(ann.id);
          return (
            <div key={ann.id} className={`p-3 bg-white/75 border border-gray-100 rounded-xl space-y-1.5 hover:border-indigo-400/50 transition-all cursor-pointer shadow-sm ${isRead ? 'opacity-55' : ''}`}>
              <h4 className="text-[12.5px] font-semibold text-gray-700 leading-snug">{ann.title}</h4>
              <div className="flex justify-between items-center text-[10px] text-gray-400">
                <span>JE Portugal Oficial</span>
                <span>{ann.date}</span>
              </div>
            </div>
          );
        })}
        {announcements.length === 0 && (
          <p className="text-[12px] text-gray-400 italic text-center py-4">Nenhum comunicado ativo.</p>
        )}
      </div>
    </div>
  );
}
