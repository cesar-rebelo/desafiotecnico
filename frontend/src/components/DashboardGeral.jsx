import { Building2, Scale, RefreshCw, MessageSquare } from 'lucide-react';
import CardMetrica from './CardMetrica';
import PainelComunicados from './PainelComunicados';

export default function DashboardGeral({ data, readIds, getStatusBadge }) {

  // Obter itens de desempenho dinamicamente a partir dos dados do backend
  const scoreItems = data.organizationsStatus
    .filter(org => org.score !== null)
    .map(org => ({ name: org.name, val: Math.round(org.score) }))
    .sort((a, b) => b.val - a.val);

  return (
    <div className="space-y-10 animate-fadeUp">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Bom dia, JE Portugal </h1>
        <p className="text-sm text-gray-400 mt-1.5">Resumo consolidado do Mandato 2026/2027 — Movimento Júnior Português.</p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <CardMetrica label="Organizações na Rede" value={data.metrics.totalOrganizations} icon={<Building2 className="w-4 h-4 text-indigo-500" />} trend="up" trendLabel="ativas" />
        <CardMetrica label="Auditorias Pendentes" value={data.metrics.pendingAudits} icon={<Scale className="w-4 h-4 text-amber-500" />} />
        <CardMetrica label="Ciclos Semestrais Ativos" value={data.metrics.activeCycles} icon={<RefreshCw className="w-4 h-4 text-emerald-500" />} trend="up" trendLabel="em curso" />
        <CardMetrica label="Comunicados na Rede" value={data.metrics.comunicadosNaoLidos} icon={<MessageSquare className="w-4 h-4 text-rose-500" />} />
      </div>

      {/* Corpo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Tabela */}
        <div className="lg:col-span-2">
          <div className="flex items-baseline justify-between mb-5">
            <div>
              <h2 className="text-[15px] font-semibold text-gray-800">Estado da Rede</h2>
              <p className="text-[12px] text-gray-400 mt-0.5">Auditoria e ciclo semestral por organização</p>
            </div>
          </div>

          <div className="bg-white/75 backdrop-blur-sm border border-white/90 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest border-b border-gray-100">
                  <th className="px-6 py-3.5 text-left">Organização</th>
                  <th className="px-6 py-3.5 text-left">Auditoria</th>
                  <th className="px-6 py-3.5 text-left">Ciclo</th>
                  <th className="px-6 py-3.5 text-right">Score</th>
                </tr>
              </thead>
              <tbody>
                {data.organizationsStatus.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-400 text-[13px]">
                      Nenhuma organização registada na base de dados.
                    </td>
                  </tr>
                ) : (
                  data.organizationsStatus.map((org, i) => (
                    <tr key={org.id} className={`hover:bg-gray-50/60 transition-colors ${i < data.organizationsStatus.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800 text-[13px]">{org.name}</span>
                          <span className="text-[10px] text-gray-400 mt-0.5">
                            {org.status === 'JUNIOR_ENTERPRISE' ? 'Júnior Empresa' : 'Júnior Iniciativa'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(org.auditStatus, 'audit')}</td>
                      <td className="px-6 py-4">{getStatusBadge(org.cycleStatus, 'cycle')}</td>
                      <td className="px-6 py-4 text-right font-semibold text-[13px]">
                        {org.score != null
                          ? <span className={org.score >= 70 ? 'text-emerald-600' : 'text-red-500'}>{org.score}%</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coluna direita — desempenho e comunicados */}
        <div className="space-y-8">
          <div>
            <h2 className="text-[15px] font-semibold text-gray-800 mb-1">Desempenho</h2>
            <p className="text-[12px] text-gray-400 mb-5">Score de auditoria por organização</p>
            <div className="space-y-4">
              {scoreItems.length === 0 ? (
                <p className="text-[12px] text-gray-400 italic">Nenhum score registado.</p>
              ) : (
                scoreItems.map((item) => (
                  <div key={item.name}>
                    <div className="flex justify-between text-[12px] mb-1.5">
                      <span className="text-gray-600 font-medium">{item.name}</span>
                      <span className={`font-semibold ${item.val >= 70 ? 'text-emerald-600' : item.val >= 50 ? 'text-amber-500' : 'text-red-400'}`}>{item.val}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${item.val >= 70 ? 'bg-indigo-500' : item.val >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                        style={{ width: `${item.val}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <PainelComunicados announcements={data.announcements} readIds={readIds} />
        </div>
      </div>
    </div>
  );
}
