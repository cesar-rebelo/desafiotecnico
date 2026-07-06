import { useState } from 'react';
import { TrendingUp, Award, Calendar, DollarSign, Users, ChevronRight } from 'lucide-react';
import FormularioCiclo from './FormularioCiclo';

export default function AcompanhamentoView({ data, onIndicatorSubmit }) {
  const [selectedJE, setSelectedJE] = useState(null);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <TrendingUp className="w-6 h-6 text-indigo-400" />
          Módulo 1: Ciclos de Acompanhamento
        </h2>
        <p className="text-sm text-slate-400">Ciclos semestrais estruturados. O acompanhamento analisa faturamento, membros e satisfação.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tabela de preenchimento */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111827]/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4">
            <h3 className="text-md font-bold text-white">Preenchimento de Indicadores</h3>
            <p className="text-xs text-slate-400">Selecione uma Júnior Empresa para enviar a grelha de indicadores correspondente ao semestre atual.</p>
            
            <div className="grid grid-cols-1 gap-3">
              {data.organizationsStatus.map((org) => (
                <div 
                  key={org.id}
                  className="p-4 bg-slate-900/20 border border-slate-800 hover:border-violet-500/40 rounded-xl flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">{org.name}</h4>
                      <p className="text-xs text-slate-500">Ciclo Atual: {org.cycleStatus === 'CLOSED' ? 'Encerrado' : 'Aberto para Envio'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedJE(org)}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-all"
                  >
                    Abrir Grelha
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Modal/Section */}
          {selectedJE && (
            <FormularioCiclo 
              selectedJE={selectedJE}
              onClose={() => setSelectedJE(null)}
              onSubmit={(formData) => {
                onIndicatorSubmit(formData);
                setSelectedJE(null);
              }}
            />
          )}
        </div>

        {/* Visualização de Métricas Históricas */}
        <div className="space-y-6">
          <div className="bg-[#111827]/40 border border-slate-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-sm space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Calendar className="w-4.5 h-4.5 text-violet-400" />
              Metas do Semestre
            </h3>
            
            <div className="space-y-4">
              {[
                { name: 'Faturamento Total da Rede', current: '€8.240', target: '€15.000', percentage: 55, icon: <DollarSign className="w-4 h-4 text-emerald-400" /> },
                { name: 'Membros Capacitados', current: '240', target: '500', percentage: 48, icon: <Users className="w-4 h-4 text-blue-400" /> },
                { name: 'Satisfação de Clientes (NPS)', current: '82%', target: '90%', percentage: 91, icon: <Award className="w-4 h-4 text-amber-400" /> }
              ].map((goal, idx) => (
                <div key={idx} className="space-y-1.5 p-3 bg-slate-900/30 border border-slate-800/60 rounded-xl">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                      {goal.icon}
                      {goal.name}
                    </span>
                    <span className="font-bold text-slate-400">{goal.current} / {goal.target}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${goal.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SVG Histograma */}
          <div className="bg-[#111827]/40 border border-slate-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Distribuição de Resultados</h3>
            
            <div className="flex items-end justify-between h-24 gap-3 pt-4">
              {[
                { val: 40, label: 'Minho' },
                { val: 80, label: 'Porto' },
                { val: 95, label: 'Lisboa' },
                { val: 20, label: 'Coimbra' }
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div 
                    className="w-full bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${bar.val}%` }}
                  />
                  <span className="text-[9px] font-bold text-slate-400">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
