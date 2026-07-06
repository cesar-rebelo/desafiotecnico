import { useState } from 'react';
import { Building2, Scale, RefreshCw, MessageSquare, Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import CardMetrica from './CardMetrica';

export default function DashboardGeral({ data, getStatusBadge, onCreateJE, newJE, setNewJE, onUpdateJE, onDeleteJE }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', status: 'JUNIOR_INITIATIVE' });

  const startEdit = (org) => {
    setEditingId(org.id);
    setEditForm({ name: org.name, status: org.status });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = (id) => {
    onUpdateJE(id, editForm.name, editForm.status);
    setEditingId(null);
  };

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
              <p className="text-[12px] text-gray-400 mt-0.5">Auditoria, ciclo semestral e ações de gestão</p>
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
                  <th className="px-6 py-3.5 text-center w-24">Ações</th>
                </tr>
              </thead>
              <tbody>
                {data.organizationsStatus.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-400 text-[13px]">
                      Nenhuma organização registada na base de dados.
                    </td>
                  </tr>
                ) : (
                  data.organizationsStatus.map((org, i) => {
                    const isEditing = editingId === org.id;
                    return (
                      <tr key={org.id} className={`hover:bg-gray-50/60 transition-colors ${i < data.organizationsStatus.length - 1 ? 'border-b border-gray-50' : ''}`}>
                        <td className="px-6 py-4">
                          {isEditing ? (
                            <div className="space-y-1.5 py-1">
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))}
                                className="px-2.5 py-1 text-[13px] border border-gray-200 rounded-lg w-full bg-white text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                              />
                              <select
                                value={editForm.status}
                                onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))}
                                className="px-2 py-1 text-[11px] border border-gray-200 rounded-lg bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              >
                                <option value="JUNIOR_INITIATIVE">Júnior Iniciativa</option>
                                <option value="JUNIOR_ENTERPRISE">Júnior Empresa</option>
                              </select>
                            </div>
                          ) : (
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-800 text-[13px]">{org.name}</span>
                              <span className="text-[10px] text-gray-400 mt-0.5">
                                {org.status === 'JUNIOR_ENTERPRISE' ? 'Júnior Empresa' : 'Júnior Iniciativa'}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(org.auditStatus, 'audit')}</td>
                        <td className="px-6 py-4">{getStatusBadge(org.cycleStatus, 'cycle')}</td>
                        <td className="px-6 py-4 text-right font-semibold text-[13px]">
                          {org.score != null
                            ? <span className={org.score >= 70 ? 'text-emerald-600' : 'text-red-500'}>{org.score}%</span>
                            : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => saveEdit(org.id)}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                title="Guardar Alterações"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                                title="Cancelar"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => startEdit(org)}
                                className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title="Editar"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteJE(org.id, org.name)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Coluna direita */}
        <div className="space-y-8">
          {/* Barras de score */}
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

          {/* Divider */}
          <div className="border-t border-gray-100" />

          {/* Formulário */}
          <div>
            <h2 className="text-[15px] font-semibold text-gray-800 mb-1">Registar Organização</h2>
            <p className="text-[12px] text-gray-400 mb-5">Adicione uma nova entidade à rede MJP.</p>
            <form onSubmit={onCreateJE} className="space-y-3">
              <input
                type="text" value={newJE.name} required
                onChange={(e) => setNewJE(p => ({ ...p, name: e.target.value }))}
                placeholder="Nome da organização"
                className="w-full text-[13px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
              />
              <select
                value={newJE.status}
                onChange={(e) => setNewJE(p => ({ ...p, status: e.target.value }))}
                className="w-full text-[13px] px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
              >
                <option value="JUNIOR_INITIATIVE">Júnior Iniciativa</option>
                <option value="JUNIOR_ENTERPRISE">Júnior Empresa</option>
              </select>
              <button type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-200">
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
