import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000/api';

function App() {
  const [data, setData] = useState({
    metrics: {
      totalOrganizations: 24,
      pendingAudits: 5,
      activeCycles: 2,
      comunicadosNaoLidos: 3
    },
    organizationsStatus: [
      { id: '1', name: 'JE Porto', auditStatus: 'APPROVED', cycleStatus: 'CLOSED', score: 94.5 },
      { id: '2', name: 'JE Lisboa', auditStatus: 'DOCUMENTS_SUBMITTED', cycleStatus: 'UNDER_REVIEW', score: null },
      { id: '3', name: 'Júnior Minho', auditStatus: 'SCHEDULED', cycleStatus: 'DRAFT', score: null },
      { id: '4', name: 'Coimbra Júnior', auditStatus: 'REJECTED', cycleStatus: 'UNDER_REVIEW', score: 45.0 }
    ],
    announcements: [
      { id: '1', title: 'Abertura das candidaturas jeniAL 2026', date: '2026-07-01' },
      { id: '2', title: 'Submissão de Censos Anuais até 31 de Julho', date: '2026-07-05' }
    ]
  });

  const [loading, setLoading] = useState(true);
  const [selectedJE, setSelectedJE] = useState(null);
  const [newJE, setNewJE] = useState({ name: '', status: 'JUNIOR_INITIATIVE' });
  const [dbStatus, setDbStatus] = useState('checking');

  // Carregar dados da API
  useEffect(() => {
    fetch(`${API_URL}/dashboard/summary`)
      .then((res) => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then((summaryData) => {
        setData(summaryData);
        setDbStatus('connected');
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Usando dados mockados (API offline):', err.message);
        setDbStatus('mocked');
        setLoading(false);
      });
  }, []);

  // Simular submissão de indicadores do Acompanhamento
  const handleIndicatorSubmit = (e) => {
    e.preventDefault();
    if (!selectedJE) return;

    alert(`Indicadores submetidos com sucesso para ${selectedJE.name}!`);
    // Atualizar estado local
    setData(prev => ({
      ...prev,
      organizationsStatus: prev.organizationsStatus.map(org => 
        org.id === selectedJE.id ? { ...org, cycleStatus: 'SUBMITTED' } : org
      )
    }));
    setSelectedJE(null);
  };

  // Simular criação de JE
  const handleCreateJE = (e) => {
    e.preventDefault();
    if (!newJE.name.trim()) return;

    const newOrg = {
      id: String(data.organizationsStatus.length + 1),
      name: newJE.name,
      auditStatus: 'SCHEDULED',
      cycleStatus: 'DRAFT',
      score: null
    };

    setData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        totalOrganizations: prev.metrics.totalOrganizations + 1
      },
      organizationsStatus: [...prev.organizationsStatus, newOrg]
    }));

    setNewJE({ name: '', status: 'JUNIOR_INITIATIVE' });
  };

  const getStatusBadge = (status, type) => {
    const config = {
      audit: {
        APPROVED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        DOCUMENTS_SUBMITTED: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        SCHEDULED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        REJECTED: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      },
      cycle: {
        CLOSED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        UNDER_REVIEW: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        SUBMITTED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        DRAFT: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
      }
    };

    const labels = {
      APPROVED: 'Aprovada',
      DOCUMENTS_SUBMITTED: 'Docs Submetidos',
      SCHEDULED: 'Agendada',
      REJECTED: 'Rejeitada',
      CLOSED: 'Concluído',
      UNDER_REVIEW: 'Em Revisão',
      SUBMITTED: 'Submetido',
      DRAFT: 'Rascunho'
    };

    return (
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${config[type][status]}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-[#1e293b]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-lg">
              JE
            </div>
            <h1 className="text-xl font-bold tracking-tight">Portal MJP <span className="text-xs text-indigo-400 font-medium">v1.0</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              API: {dbStatus === 'connected' ? 'Online' : 'Simulado (Offline)'}
            </span>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400">
              IT
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner de Boas-Vindas */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/20 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">Painel de Gestão da Federação</h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Centralização e controle de Ciclos de Acompanhamento, Auditoria & Certificação para todo o Movimento Júnior Português.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-[radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
          </div>
        ) : (
          <>
            {/* Grid de Métricas Globais */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Júnior Empresas', val: data.metrics.totalOrganizations, icon: '🏢', color: 'border-blue-500/20 text-blue-400' },
                { label: 'Auditorias Pendentes', val: data.metrics.pendingAudits, icon: '⚖️', color: 'border-amber-500/20 text-amber-400' },
                { label: 'Ciclos Ativos', val: data.metrics.activeCycles, icon: '🔄', color: 'border-emerald-500/20 text-emerald-400' },
                { label: 'Avisos Não Lidos', val: data.metrics.comunicadosNaoLidos, icon: '📢', color: 'border-rose-500/20 text-rose-400' }
              ].map((m, idx) => (
                <div key={idx} className={`p-5 rounded-2xl bg-[#1e293b]/40 border ${m.color} backdrop-blur-sm transition-all hover:scale-[1.02] shadow-lg`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{m.label}</span>
                    <span className="text-2xl">{m.icon}</span>
                  </div>
                  <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">{m.val}</span>
                </div>
              ))}
            </div>

            {/* Grid Principal Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Tabela de Organizações - Coluna da Esquerda (2/3 de espaço no LG) */}
              <div className="lg:col-span-2 space-y-6">
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
                        {data.organizationsStatus.map((org) => (
                          <tr key={org.id} className="hover:bg-slate-800/35 transition-colors">
                            <td className="px-6 py-4 font-medium text-white">{org.name}</td>
                            <td className="px-6 py-4">{getStatusBadge(org.auditStatus, 'audit')}</td>
                            <td className="px-6 py-4">{getStatusBadge(org.cycleStatus, 'cycle')}</td>
                            <td className="px-6 py-4 font-mono font-bold text-indigo-400">
                              {org.score ? `${org.score}%` : '-'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => setSelectedJE(org)}
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

                {/* Formulário para Submeter Indicadores de Acompanhamento */}
                {selectedJE && (
                  <div className="p-6 bg-slate-900/60 border border-indigo-500/30 rounded-2xl shadow-xl space-y-4 animate-fadeIn">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-indigo-400">Preencher Ciclo Semestral: {selectedJE.name}</h3>
                      <button 
                        onClick={() => setSelectedJE(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    <form onSubmit={handleIndicatorSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Faturamento (€)</label>
                        <input required type="number" className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500" placeholder="1500" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Número de Membros</label>
                        <input required type="number" className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500" placeholder="30" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">NPS (Net Promoter Score)</label>
                        <input required type="number" max="100" min="-100" className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500" placeholder="80" />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Semestre de Referência</label>
                        <select className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500">
                          <option>2026.1</option>
                          <option>2026.2</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all">
                          Submeter Grelha de Indicadores
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Coluna da Direita (Painel Lateral) */}
              <div className="space-y-6">
                {/* Criar Nova Organização */}
                <div className="bg-[#1e293b]/30 border border-slate-800 p-6 rounded-2xl shadow-xl">
                  <h3 className="text-md font-bold mb-1">Registar Organização</h3>
                  <p className="text-xs text-slate-400 mb-4">Adicione uma Júnior Empresa ou Júnior Iniciativa à rede.</p>
                  <form onSubmit={handleCreateJE} className="space-y-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Nome da Organização</label>
                      <input 
                        type="text" 
                        value={newJE.name}
                        onChange={(e) => setNewJE(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500" 
                        placeholder="Ex: Minho Júnior" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Tipo</label>
                      <select 
                        value={newJE.status}
                        onChange={(e) => setNewJE(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="JUNIOR_INITIATIVE">Júnior Iniciativa</option>
                        <option value="JUNIOR_ENTERPRISE">Júnior Empresa</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg text-sm font-semibold transition-all border border-slate-700">
                      Registar na Rede
                    </button>
                  </form>
                </div>

                {/* Comunicados Recentes (Módulo de Comunicação) */}
                <div className="bg-[#1e293b]/30 border border-slate-800 p-6 rounded-2xl shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-bold">Comunicação Oficial</h3>
                    <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-semibold">
                      {data.announcements.length} Novos
                    </span>
                  </div>
                  <div className="space-y-3">
                    {data.announcements.map((ann) => (
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
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
