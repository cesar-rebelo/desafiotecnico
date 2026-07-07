import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Target, RefreshCw } from 'lucide-react';
import FormularioCiclo from './FormularioCiclo';
import { api } from '../services/api';

export default function AcompanhamentoView({ data, onIndicatorSubmit }) {
  const [selectedJE, setSelectedJE] = useState(null);
  const [activeCycle, setActiveCycle] = useState(null);
  const [loadingCycle, setLoadingCycle] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Carregar os dados de indicadores reais sempre que a organização selecionada for alterada
  useEffect(() => {
    if (!selectedJE) {
      setActiveCycle(null);
      setIsEditing(false);
      return;
    }
    (async () => {
      setLoadingCycle(true);
      try {
        const cycle = await api.getIndicatorCycles(selectedJE.id);
        setActiveCycle(cycle);
        setIsEditing(!cycle); // Abre o formulário apenas se não existirem dados
      } catch (err) {
        console.error('Erro ao consultar ciclo:', err);
        setIsEditing(true);
      } finally {
        setLoadingCycle(false);
      }
    })();
  }, [selectedJE]);

  const handleFormSubmit = async (formData) => {
    await onIndicatorSubmit(formData);
    // Recarregar os dados
    try {
      const cycle = await api.getIndicatorCycles(selectedJE.id);
      setActiveCycle(cycle);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const getIndicatorValue = (key) => {
    if (!activeCycle || !activeCycle.indicators) return '—';
    const ind = activeCycle.indicators.find(i => i.key === key || (key === 'NumeroMembros' && i.key === 'NumeroMembros'));
    return ind ? ind.value.toLocaleString('pt-PT') : '—';
  };

  return (
    <div className="space-y-10 animate-fadeUp">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Ciclos de Acompanhamento</h1>
        <p className="text-sm text-gray-400 mt-1.5">Grelhas semestrais de indicadores por Júnior Empresa — Mandato 2026/2027.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Lista de organizações */}
          <div>
            <h2 className="text-[14px] font-semibold text-gray-700 mb-4">Organizações com Grelha Aberta</h2>
            <div className="bg-white/75 backdrop-blur-sm border border-white/90 rounded-2xl overflow-hidden shadow-sm">
              {data.organizationsStatus.length === 0 ? (
                <p className="px-6 py-8 text-center text-gray-400 italic">Nenhuma organização encontrada.</p>
              ) : (
                data.organizationsStatus.map((org, i) => {
                  const isSelected = selectedJE?.id === org.id;
                  return (
                    <div key={org.id}
                      className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors ${i < data.organizationsStatus.length - 1 ? 'border-b border-gray-50' : ''
                        } ${isSelected ? 'bg-indigo-50/20' : ''}`}
                    >
                      <div>
                        <p className="text-[13px] font-semibold text-gray-800">{org.name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Ciclo 2026.1 · {org.cycleStatus === 'CLOSED' ? 'Concluído' : org.cycleStatus === 'SUBMITTED' ? 'Submetido' : org.cycleStatus === 'UNDER_REVIEW' ? 'Em Revisão' : 'A aguardar submissão'}
                        </p>
                      </div>
                      <button onClick={() => setSelectedJE(org)}
                        className={`text-[12px] font-semibold transition-colors ${isSelected ? 'text-indigo-800' : 'text-indigo-600 hover:text-indigo-800'}`}>
                        {isSelected ? 'Selecionado' : 'Preencher / Ver →'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Painel de Indicadores / Formulário */}
          {selectedJE && (
            <div className="animate-fadeUp">
              {loadingCycle ? (
                <div className="bg-white border border-gray-200/50 rounded-2xl p-6 flex items-center justify-center h-48 shadow-sm">
                  <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
                </div>
              ) : isEditing ? (
                <FormularioCiclo
                  selectedJE={selectedJE}
                  onClose={() => setSelectedJE(null)}
                  onSubmit={handleFormSubmit}
                  initialValues={activeCycle ? {
                    faturamento: activeCycle.indicators.find(i => i.key === 'Faturamento')?.value || '',
                    membros: activeCycle.indicators.find(i => i.key === 'NumeroMembros')?.value || selectedJE.members || '',
                    nps: activeCycle.indicators.find(i => i.key === 'NPS')?.value || '',
                    semester: activeCycle.semester || '2026.1'
                  } : {
                    faturamento: '',
                    membros: selectedJE.members || '',
                    nps: '',
                    semester: '2026.1'
                  }}
                />
              ) : (
                <div className="bg-white border border-gray-200/50 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-[14px] font-bold text-gray-900">Indicadores Submetidos</h3>
                      <p className="text-[12px] text-gray-400">{selectedJE.name} · Semestre {activeCycle?.semester || '2026.1'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[11px] font-semibold rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        Editar Indicadores
                      </button>
                      <button onClick={() => setSelectedJE(null)} className="text-gray-300 hover:text-gray-500 text-lg leading-none transition-colors px-1">×</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Faturamento</p>
                      <p className="text-lg font-bold text-gray-800 mt-1 flex items-baseline gap-0.5">
                        {getIndicatorValue('Faturamento')}<span className="text-[11px] font-normal text-gray-400">€</span>
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Membros</p>
                      <p className="text-lg font-bold text-gray-800 mt-1">
                        {getIndicatorValue('NumeroMembros')}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">NPS Médio</p>
                      <p className="text-lg font-bold text-gray-800 mt-1">
                        {getIndicatorValue('NPS')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Metas semestrais */}
        <div>
          <h2 className="text-[14px] font-semibold text-gray-700 mb-4">Metas Semestrais</h2>
          <div className="space-y-6">
            {[
              { label: 'Faturamento (€)', current: data.metrics.totalFaturamento || 0, target: 15000, icon: <DollarSign className="w-3.5 h-3.5 text-indigo-400" /> },
              { label: 'Membros Capacitados', current: data.metrics.totalMembros || 0, target: 500, icon: <Users className="w-3.5 h-3.5 text-indigo-400" /> },
              { label: 'NPS Médio (%)', current: data.metrics.averageNps || 0, target: 90, icon: <Target className="w-3.5 h-3.5 text-indigo-400" /> },
            ].map((m) => {
              const pct = Math.min(100, Math.round((m.current / m.target) * 100));
              return (
                <div key={m.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-gray-600 font-medium flex items-center gap-1.5">{m.icon}{m.label}</span>
                    <span className="text-[11px] text-gray-400 font-semibold">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-300">{m.current.toLocaleString('pt-PT')} / {m.target.toLocaleString('pt-PT')}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
