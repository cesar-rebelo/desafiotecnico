import { useState, useEffect } from 'react';
import { api } from './services/api';
import CardMetrica from './components/CardMetrica';
import TabelaOrganizacoes from './components/TabelaOrganizacoes';
import FormularioCiclo from './components/FormularioCiclo';
import PainelComunicados from './components/PainelComunicados';

function App() {
  const [data, setData] = useState({
    metrics: {
      totalOrganizations: 0,
      pendingAudits: 0,
      activeCycles: 0,
      comunicadosNaoLidos: 0
    },
    organizationsStatus: [],
    announcements: []
  });

  const [loading, setLoading] = useState(true);
  const [selectedJE, setSelectedJE] = useState(null);
  const [newJE, setNewJE] = useState({ name: '', status: 'JUNIOR_INITIATIVE' });
  const [dbStatus, setDbStatus] = useState('checking');

  // Buscar dados consolidados do backend
  const loadDashboardData = async () => {
    try {
      const summaryData = await api.getDashboardSummary();
      // Opcional: Buscar também a lista real de organizações do backend caso mude de forma isolada
      const orgs = await api.getOrganizations();
      
      setData({
        ...summaryData,
        organizationsStatus: orgs
      });
      setDbStatus('connected');
    } catch (err) {
      console.warn('Usando dados mockados locais (API offline):', err.message);
      // Fallback para mock local estruturado
      setData({
        metrics: {
          totalOrganizations: 24,
          pendingAudits: 5,
          activeCycles: 2,
          comunicadosNaoLidos: 3
        },
        organizationsStatus: [
          { id: '1', name: 'JE Porto (Simulado)', auditStatus: 'APPROVED', cycleStatus: 'CLOSED', score: 94.5 },
          { id: '2', name: 'JE Lisboa (Simulado)', auditStatus: 'DOCUMENTS_SUBMITTED', cycleStatus: 'UNDER_REVIEW', score: null },
          { id: '3', name: 'Júnior Minho (Simulado)', auditStatus: 'SCHEDULED', cycleStatus: 'DRAFT', score: null },
          { id: '4', name: 'Coimbra Júnior (Simulado)', auditStatus: 'REJECTED', cycleStatus: 'UNDER_REVIEW', score: 45.0 }
        ],
        announcements: [
          { id: '1', title: 'Abertura das candidaturas jeniAL 2026', date: '2026-07-01' },
          { id: '2', title: 'Submissão de Censos Anuais até 31 de Julho', date: '2026-07-05' }
        ]
      });
      setDbStatus('mocked');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Submeter grelha de indicadores (Módulo Acompanhamento) via API
  const handleIndicatorSubmit = async (formData) => {
    try {
      await api.submitIndicators(formData);
      alert(`Indicadores submetidos com sucesso para a JE!`);
      // Atualizar status local na tabela
      setData(prev => ({
        ...prev,
        organizationsStatus: prev.organizationsStatus.map(org => 
          org.id === formData.organizationId ? { ...org, cycleStatus: 'SUBMITTED' } : org
        )
      }));
      setSelectedJE(null);
    } catch (err) {
      alert(`Erro na API, mas os dados foram atualizados localmente (modo offline).`);
      setData(prev => ({
        ...prev,
        organizationsStatus: prev.organizationsStatus.map(org => 
          org.id === formData.organizationId ? { ...org, cycleStatus: 'SUBMITTED' } : org
        )
      }));
      setSelectedJE(null);
    }
  };

  // Registar nova organização na rede via API
  const handleCreateJE = async (e) => {
    e.preventDefault();
    if (!newJE.name.trim()) return;

    try {
      const created = await api.createOrganization(newJE);
      setData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          totalOrganizations: prev.metrics.totalOrganizations + 1
        },
        organizationsStatus: [...prev.organizationsStatus, created]
      }));
      alert(`Organização "${newJE.name}" registada com sucesso!`);
    } catch (err) {
      // Fallback local se API falhar
      const fallbackOrg = {
        id: String(data.organizationsStatus.length + 1),
        name: `${newJE.name} (Local)`,
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
        organizationsStatus: [...prev.organizationsStatus, fallbackOrg]
      }));
      alert(`Registado localmente (Offline).`);
    } finally {
      setNewJE({ name: '', status: 'JUNIOR_INITIATIVE' });
    }
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
      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${config[type][status] || 'border-slate-800 text-slate-400 bg-slate-900/30'}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans">
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
              API: {dbStatus === 'connected' ? 'Conectada (Express)' : 'Modo Simulado (Offline)'}
            </span>
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400">
              IT
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/20 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">Painel de Gestão da Federação</h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Desenho modular por componentes e comunicação de rotas API estruturada.
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <CardMetrica label="Júnior Empresas" value={data.metrics.totalOrganizations} icon="🏢" color="border-blue-500/20 text-blue-400" />
              <CardMetrica label="Auditorias Pendentes" value={data.metrics.pendingAudits} icon="⚖️" color="border-amber-500/20 text-amber-400" />
              <CardMetrica label="Ciclos Ativos" value={data.metrics.activeCycles} icon="🔄" color="border-emerald-500/20 text-emerald-400" />
              <CardMetrica label="Avisos Não Lidos" value={data.metrics.comunicadosNaoLidos} icon="📢" color="border-rose-500/20 text-rose-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <TabelaOrganizacoes 
                  orgs={data.organizationsStatus} 
                  onSelectCycle={setSelectedJE} 
                  getStatusBadge={getStatusBadge} 
                />

                {selectedJE && (
                  <FormularioCiclo 
                    selectedJE={selectedJE} 
                    onSubmit={handleIndicatorSubmit} 
                    onClose={() => setSelectedJE(null)} 
                  />
                )}
              </div>

              <div className="space-y-6">
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

                <PainelComunicados announcements={data.announcements} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
