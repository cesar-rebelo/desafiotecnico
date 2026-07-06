import { useState } from 'react';
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';
import FormularioCiclo from './FormularioCiclo';

export default function AcompanhamentoView({ data, onIndicatorSubmit }) {
  const [selectedJE, setSelectedJE] = useState(null);

  return (
    <div className="space-y-10 animate-fadeUp">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Ciclos de Acompanhamento</h1>
        <p className="text-sm text-gray-400 mt-1.5">Grelhas semestrais de indicadores por Júnior Empresa — Mandato 2026/2027.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Lista sem excesso de caixas */}
          <div>
            <h2 className="text-[14px] font-semibold text-gray-700 mb-4">Organizações com Grelha Aberta</h2>
            <div className="bg-white/75 backdrop-blur-sm border border-white/90 rounded-2xl overflow-hidden">
              {data.organizationsStatus.map((org, i) => (
                <div key={org.id}
                  className={`flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors ${i < data.organizationsStatus.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <div>
                    <p className="text-[13px] font-semibold text-gray-800">{org.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Ciclo 2026.1 · {org.cycleStatus === 'CLOSED' ? 'Encerrado' : 'A aguardar submissão'}</p>
                  </div>
                  <button onClick={() => setSelectedJE(org)}
                    className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
                    Preencher →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {selectedJE && (
            <div className="animate-fadeUp">
              <FormularioCiclo
                selectedJE={selectedJE}
                onClose={() => setSelectedJE(null)}
                onSubmit={(d) => { onIndicatorSubmit(d); setSelectedJE(null); }}
              />
            </div>
          )}
        </div>

        {/* Metas — sem caixa, diretamente no layout */}
        <div>
          <h2 className="text-[14px] font-semibold text-gray-700 mb-4">Metas Semestrais</h2>
          <div className="space-y-6">
            {[
              { label: 'Faturamento (€)',     current: 8240,  target: 15000, icon: <DollarSign className="w-3.5 h-3.5 text-indigo-400" /> },
              { label: 'Membros Capacitados', current: 240,   target: 500,   icon: <Users      className="w-3.5 h-3.5 text-indigo-400" /> },
              { label: 'NPS Médio (%)',        current: 82,    target: 90,    icon: <Target     className="w-3.5 h-3.5 text-indigo-400" /> },
            ].map((m) => {
              const pct = Math.min(100, Math.round((m.current / m.target) * 100));
              return (
                <div key={m.label} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-gray-600 font-medium flex items-center gap-1.5">{m.icon}{m.label}</span>
                    <span className="text-[11px] text-gray-400 font-semibold">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
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
