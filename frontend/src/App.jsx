import { useState, useEffect } from 'react';
import { api } from './services/api';
import Sidebar from './components/Sidebar';
import DashboardGeral from './components/DashboardGeral';
import AcompanhamentoView from './components/AcompanhamentoView';
import AuditoriaView from './components/AuditoriaView';
import CensosView from './components/CensosView';
import ComunicacaoView from './components/ComunicacaoView';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
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
  const [dbStatus, setDbStatus] = useState('checking');

  // Novo estado de controlo para registo de JEs
  const [newJE, setNewJE] = useState({ name: '', status: 'JUNIOR_INITIATIVE' });

  // Buscar dados consolidados do backend
  const loadDashboardData = async () => {
    try {
      const summaryData = await api.getDashboardSummary();
      const orgs = await api.getOrganizations();
      
      setData({
        ...summaryData,
        organizationsStatus: orgs
      });
      setDbStatus('connected');
    } catch (err) {
      console.warn('Usando dados mockados locais (API offline):', err.message);
      // Fallback local robusto se o backend/banco de dados estiver offline
      setData({
        metrics: {
          totalOrganizations: 24,
          pendingAudits: 5,
          activeCycles: 2,
          comunicadosNaoLidos: 2
        },
        organizationsStatus: [
          { id: '1', name: 'JE Porto', status: 'JUNIOR_ENTERPRISE', auditStatus: 'APPROVED', cycleStatus: 'CLOSED', score: 94.5 },
          { id: '2', name: 'JE Lisboa', status: 'JUNIOR_ENTERPRISE', auditStatus: 'DOCUMENTS_SUBMITTED', cycleStatus: 'UNDER_REVIEW', score: null },
          { id: '3', name: 'Júnior Minho', status: 'JUNIOR_INITIATIVE', auditStatus: 'SCHEDULED', cycleStatus: 'DRAFT', score: null },
          { id: '4', name: 'Coimbra Júnior', status: 'JUNIOR_ENTERPRISE', auditStatus: 'REJECTED', cycleStatus: 'UNDER_REVIEW', score: 45.0 }
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
      setData(prev => ({
        ...prev,
        organizationsStatus: prev.organizationsStatus.map(org => 
          org.id === formData.organizationId ? { ...org, cycleStatus: 'SUBMITTED' } : org
        )
      }));
    } catch (err) {
      alert(`Erro na API, mas os dados foram atualizados localmente (modo offline).`);
      setData(prev => ({
        ...prev,
        organizationsStatus: prev.organizationsStatus.map(org => 
          org.id === formData.organizationId ? { ...org, cycleStatus: 'SUBMITTED' } : org
        )
      }));
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
        name: newJE.name,
        status: newJE.status,
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
      alert(`Registado localmente (Modo Simulado).`);
    } finally {
      setNewJE({ name: '', status: 'JUNIOR_INITIATIVE' });
    }
  };

  const getStatusBadge = (status, type) => {
    const config = {
      audit: {
        APPROVED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        DOCUMENTS_SUBMITTED: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        SCHEDULED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        REJECTED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      },
      cycle: {
        CLOSED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        UNDER_REVIEW: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        SUBMITTED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        DRAFT: 'bg-slate-500/10 text-slate-400 border-slate-550/20',
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
      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border uppercase tracking-wider ${config[type][status] || 'border-slate-800 text-slate-400 bg-slate-900/30'}`}>
        {labels[status] || status}
      </span>
    );
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardGeral 
            data={data}
            getStatusBadge={getStatusBadge}
            onSelectJE={() => setActiveTab('acompanhamento')}
            newJE={newJE}
            setNewJE={setNewJE}
            onCreateJE={handleCreateJE}
          />
        );
      case 'acompanhamento':
        return (
          <AcompanhamentoView 
            data={data}
            onIndicatorSubmit={handleIndicatorSubmit}
          />
        );
      case 'auditoria':
        return <AuditoriaView data={data} />;
      case 'censos':
        return <CensosView />;
      case 'comunicacao':
        return <ComunicacaoView announcements={data.announcements} />;
      default:
        return <div className="text-white">Aba não encontrada.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#090b11] text-slate-100 flex overflow-hidden">
      {/* Sidebar de Navegação Lateral */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} dbStatus={dbStatus} />

      {/* Área Central de Conteúdo */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto bg-gradient-to-b from-[#090b11] via-[#0f131f] to-[#090b11]">
        
        {/* Barra superior fina */}
        <header className="h-16 border-b border-slate-900 flex items-center justify-end px-8 gap-4 bg-[#090b11]/40 backdrop-blur-md sticky top-0 z-40">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
            Sessão IT Manager
          </div>
        </header>

        {/* Corpo principal */}
        <div className="p-8 max-w-7xl w-full mx-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" />
            </div>
          ) : (
            renderActiveTab()
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
