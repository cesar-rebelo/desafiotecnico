import { useState, useEffect } from 'react';
import { api } from './services/api';
import Sidebar from './components/Sidebar';
import DashboardGeral from './components/DashboardGeral';
import AcompanhamentoView from './components/AcompanhamentoView';
import AuditoriaView from './components/AuditoriaView';
import CensosView from './components/CensosView';
import ComunicacaoView from './components/ComunicacaoView';

const MOCK_DATA = {
  metrics: { totalOrganizations: 24, pendingAudits: 5, activeCycles: 2, comunicadosNaoLidos: 2 },
  organizationsStatus: [
    { id: '1', name: 'JE Porto',       status: 'JUNIOR_ENTERPRISE', auditStatus: 'APPROVED',            cycleStatus: 'CLOSED',       score: 94.5 },
    { id: '2', name: 'JE Lisboa',      status: 'JUNIOR_ENTERPRISE', auditStatus: 'DOCUMENTS_SUBMITTED', cycleStatus: 'UNDER_REVIEW', score: null },
    { id: '3', name: 'Júnior Minho',   status: 'JUNIOR_INITIATIVE', auditStatus: 'SCHEDULED',           cycleStatus: 'DRAFT',        score: null },
    { id: '4', name: 'Coimbra Júnior', status: 'JUNIOR_ENTERPRISE', auditStatus: 'REJECTED',            cycleStatus: 'UNDER_REVIEW', score: 45.0 },
  ],
  announcements: [
    { id: '1', title: 'Abertura das candidaturas jeniAL 2026',     date: '2026-07-01' },
    { id: '2', title: 'Submissão de Censos Anuais até 31 de Julho', date: '2026-07-05' },
  ],
};

const BADGE_CLASS = {
  audit: {
    APPROVED:            'bg-emerald-50 text-emerald-700',
    DOCUMENTS_SUBMITTED: 'bg-amber-50   text-amber-700',
    SCHEDULED:           'bg-gray-100   text-gray-500',
    REJECTED:            'bg-red-50     text-red-600',
  },
  cycle: {
    CLOSED:       'bg-emerald-50 text-emerald-700',
    UNDER_REVIEW: 'bg-amber-50   text-amber-700',
    SUBMITTED:    'bg-blue-50    text-blue-700',
    DRAFT:        'bg-gray-100   text-gray-500',
  },
};
const LABEL = {
  APPROVED:'Aprovada', DOCUMENTS_SUBMITTED:'Docs Enviados', SCHEDULED:'Agendada', REJECTED:'Rejeitada',
  CLOSED:'Concluído', UNDER_REVIEW:'Em Revisão', SUBMITTED:'Submetido', DRAFT:'Rascunho',
};

function getStatusBadge(status, type) {
  const cls = BADGE_CLASS[type]?.[status] ?? 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {LABEL[status] ?? status}
    </span>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData]           = useState(MOCK_DATA);
  const [loading, setLoading]     = useState(true);
  const [newJE, setNewJE]         = useState({ name: '', status: 'JUNIOR_INITIATIVE' });

  useEffect(() => {
    (async () => {
      try {
        const [summary, orgs] = await Promise.all([api.getDashboardSummary(), api.getOrganizations()]);
        setData({ ...summary, organizationsStatus: orgs });
      } catch { setData(MOCK_DATA); }
      finally  { setLoading(false); }
    })();
  }, []);

  const handleCreateJE = async (e) => {
    e.preventDefault();
    const name = newJE.name.trim();
    if (!name) return;
    const fallback = { id: Date.now().toString(), name, status: newJE.status, auditStatus: 'SCHEDULED', cycleStatus: 'DRAFT', score: null };
    try { const created = await api.createOrganization(newJE); pushOrg(created); }
    catch { pushOrg(fallback); }
    setNewJE({ name: '', status: 'JUNIOR_INITIATIVE' });
  };

  const pushOrg = (org) => setData(p => ({
    ...p,
    metrics: { ...p.metrics, totalOrganizations: p.metrics.totalOrganizations + 1 },
    organizationsStatus: [...p.organizationsStatus, org],
  }));

  const handleIndicators = async (formData) => {
    try { await api.submitIndicators(formData); } catch {}
    setData(p => ({
      ...p,
      organizationsStatus: p.organizationsStatus.map(o =>
        o.id === formData.organizationId ? { ...o, cycleStatus: 'SUBMITTED' } : o
      ),
    }));
  };

  const PAGE_TITLES = {
    dashboard: 'Visão Geral', acompanhamento: 'Acompanhamento',
    auditoria: 'Auditoria', censos: 'Censos Anuais', comunicacao: 'Comunicação',
  };

  const views = {
    dashboard:      <DashboardGeral data={data} getStatusBadge={getStatusBadge} onCreateJE={handleCreateJE} newJE={newJE} setNewJE={setNewJE} />,
    acompanhamento: <AcompanhamentoView data={data} onIndicatorSubmit={handleIndicators} />,
    auditoria:      <AuditoriaView data={data} />,
    censos:         <CensosView />,
    comunicacao:    <ComunicacaoView announcements={data.announcements} />,
  };

  return (
    <>
      {/* Camada de textura JE animada */}
      <div className="je-bg" aria-hidden="true" />

      <div className="relative z-10 flex h-screen overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar muito fina */}
          <header className="h-12 bg-white/70 backdrop-blur-md border-b border-gray-200/60 flex items-center px-10 shrink-0">
            <p className="text-[12px] text-gray-400 font-medium tracking-wide">
              JE Portugal &nbsp;/&nbsp;
              <span className="text-gray-700 font-semibold">{PAGE_TITLES[activeTab]}</span>
            </p>
          </header>

          <main className="flex-1 overflow-y-auto px-10 py-10">
            {loading
              ? <div className="flex items-center justify-center h-64">
                  <div className="w-7 h-7 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
                </div>
              : views[activeTab]
            }
          </main>
        </div>
      </div>
    </>
  );
}
