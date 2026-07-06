import { Building2, Scale, RefreshCw, MessageSquare, ArrowUpRight, Plus } from 'lucide-react';
import CardMetrica from './CardMetrica';

export default function DashboardGeral({ data, getStatusBadge, onCreateJE, newJE, setNewJE }) {
  return (
    <div className="space-y-7 animate-fadeUp">

      {/* Header */}
      <div>
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Bom dia, Equipa IT 👋</h1>
        <p className="text-sm text-gray-400 mt-0.5">Resumo do Mandato 2026/2027 — Movimento Júnior Português.</p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <CardMetrica
          label="Organizações na Rede"
          value={data.metrics.totalOrganizations}
          icon={<Building2 className="w-4 h-4 text-indigo-500" />}
          trend="up" trendLabel="+2"
        />
        <CardMetrica
          label="Auditorias Pendentes"
          value={data.metrics.pendingAudits}
          icon={<Scale className="w-4 h-4 text-amber-500" />}
        />
        <CardMetrica
          label="Ciclos Semestrais Ativos"
          value={data.metrics.activeCycles}
          icon={<RefreshCw className="w-4 h-4 text-emerald-500" />}
          trend="up" trendLabel="em curso"
        />
        <CardMetrica
          label="Comunicados por Ler"
          value={data.metrics.comunicadosNaoLidos}
          icon={<MessageSquare className="w-4 h-4 text-rose-500" />}
        />
      </div>

      {/* Conteúdo central */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Tabela */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div>
              <h3 className="text-[14px] font-semibold text-gray-800">Estado da Rede</h3>
              <p className="text-[11px] text-gray-400">Ciclos semestrais e auditoria por organização</p>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider border-b border-gray-50">
                <th className="px-6 py-3 text-left">Organização</th>
                <th className="px-6 py-3 text-left">Auditoria</th>
                <th className="px-6 py-3 text-left">Ciclo</th>
                <th className="px-6 py-3 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.organizationsStatus.map((org) => (
                <tr key={org.id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-6 py-3.5 font-medium text-gray-800 text-[13px]">{org.name}</td>
                  <td className="px-6 py-3.5">{getStatusBadge(org.auditStatus, 'audit')}</td>
                  <td className="px-6 py-3.5">{getStatusBadge(org.cycleStatus, 'cycle')}</td>
                  <td className="px-6 py-3.5 text-right font-semibold text-[13px] text-gray-700">
                    {org.score != null ? `${org.score}%` : <span className="text-gray-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Painel lateral */}
        <div className="space-y-5">
          {/* Gráfico bar */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h3 className="text-[13px] font-semibold text-gray-800 mb-1">Desempenho da Rede</h3>
            <p className="text-[11px] text-gray-400 mb-4">Scores de auditoria por organização</p>
            <div className="space-y-3">
              {[
                { name: 'JE Porto',      val: 94 },
                { name: 'JE Lisboa',     val: 72 },
                { name: 'Coimbra Jr.',   val: 45 },
                { name: 'Júnior Minho',  val: 30 },
              ].map((item) => (
                <div key={item.name}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-gray-600 font-medium">{item.name}</span>
                    <span className="text-gray-400 font-semibold">{item.val}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.val >= 70 ? 'bg-indigo-500' : item.val >= 50 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulário Nova JE */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h3 className="text-[13px] font-semibold text-gray-800 mb-1">Registar Organização</h3>
            <p className="text-[11px] text-gray-400 mb-4">Adicione uma nova entidade à rede MJP.</p>
            <form onSubmit={onCreateJE} className="space-y-3">
              <input
                type="text"
                value={newJE.name}
                onChange={(e) => setNewJE(p => ({ ...p, name: e.target.value }))}
                placeholder="Nome da organização"
                required
                className="w-full text-[13px] px-3.5 py-2.5 border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
              />
              <select
                value={newJE.status}
                onChange={(e) => setNewJE(p => ({ ...p, status: e.target.value }))}
                className="w-full text-[13px] px-3.5 py-2.5 border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
              >
                <option value="JUNIOR_INITIATIVE">Júnior Iniciativa</option>
                <option value="JUNIOR_ENTERPRISE">Júnior Empresa</option>
              </select>
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Registar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
