export default function TabelaOrganizacoes({ orgs, onSelectCycle, getStatusBadge }) {
  return (
    <div className="bg-[#1e293b]/30 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
        <div>
          <h3 className="text-lg font-bold">Estado das Organizações</h3>
          <p className="text-xs text-slate-400">Status dos ciclos semestrais e auditorias de qualidade.</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-[#0f172a]/40 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Júnior Empresa</th>
              <th className="px-6 py-4">Auditoria</th>
              <th className="px-6 py-4">Acompanhamento</th>
              <th className="px-6 py-4">Score</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {orgs.map((org) => (
              <tr key={org.id} className="hover:bg-slate-800/35 transition-colors">
                <td className="px-6 py-4 font-medium text-white">{org.name}</td>
                <td className="px-6 py-4">{getStatusBadge(org.auditStatus, 'audit')}</td>
                <td className="px-6 py-4">{getStatusBadge(org.cycleStatus, 'cycle')}</td>
                <td className="px-6 py-4 font-mono font-bold text-indigo-400">
                  {org.score ? `${org.score}%` : '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onSelectCycle(org)}
                    className="px-3 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
                  >
                    Preencher Ciclo
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
