import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { api } from './services/api';
import Sidebar from './components/Sidebar';
import DashboardGeral from './components/DashboardGeral';
import AcompanhamentoView from './components/AcompanhamentoView';
import AuditoriaView from './components/AuditoriaView';
import CensosView from './components/CensosView';
import ComunicacaoView from './components/ComunicacaoView';
import JeBackground from './components/JeBackground';
import ConfirmModal from './components/ConfirmModal';

const MOCK_DATA = {
  metrics: { totalOrganizations: 0, pendingAudits: 0, activeCycles: 0, comunicadosNaoLidos: 0 },
  organizationsStatus: [],
  announcements: [],
};

const BADGE_CLASS = {
  audit: {
    APPROVED:            'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
    DOCUMENTS_SUBMITTED: 'bg-amber-50   text-amber-700   border border-amber-200/50',
    SCHEDULED:           'bg-gray-100   text-gray-500   border border-gray-200/50',
    REJECTED:            'bg-red-50     text-red-600     border border-red-200/50',
  },
  cycle: {
    CLOSED:       'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
    UNDER_REVIEW: 'bg-amber-50   text-amber-700   border border-amber-200/50',
    SUBMITTED:    'bg-blue-50    text-blue-700    border border-blue-200/50',
    DRAFT:        'bg-gray-100   text-gray-500    border border-gray-200/50',
  },
};
const LABEL = {
  APPROVED:'Aprovada', DOCUMENTS_SUBMITTED:'Docs Enviados', SCHEDULED:'Agendada', REJECTED:'Rejeitada',
  CLOSED:'Concluído', UNDER_REVIEW:'Em Revisão', SUBMITTED:'Submetido', DRAFT:'Rascunho',
};

function getStatusBadge(status, type) {
  const cls = BADGE_CLASS[type]?.[status] ?? 'bg-gray-100 text-gray-500 border border-gray-200/50';
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>
      {LABEL[status] ?? status}
    </span>
  );
}

export default function App() {
  const location = useLocation();
  const [data, setData]           = useState(MOCK_DATA);
  const [loading, setLoading]     = useState(true);
  const [newJE, setNewJE]         = useState({ name: '', status: 'JUNIOR_INITIATIVE' });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Estado para o Pop-up customizado de confirmação
  const [confirmData, setConfirmData] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const refreshData = async () => {
    try {
      const summary = await api.getDashboardSummary();
      setData(summary);
    } catch (err) {
      console.error('Error fetching data from API:', err);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await refreshData();
      setLoading(false);
    })();
  }, []);

  const handleCreateJE = async (e) => {
    e.preventDefault();
    const name = newJE.name.trim();
    if (!name) return;
    try {
      await api.createOrganization({ name, status: newJE.status });
      await refreshData();
      setNewJE({ name: '', status: 'JUNIOR_INITIATIVE' });
    } catch (err) {
      console.error('Error creating organization:', err);
    }
  };

  const handleUpdateJE = async (id, name, status) => {
    try {
      await api.updateOrganization(id, { name, status });
      await refreshData();
    } catch (err) {
      console.error('Error updating organization:', err);
    }
  };

  const handleDeleteJE = (id, name) => {
    setConfirmData({
      isOpen: true,
      title: 'Eliminar Organização',
      message: `Tem a certeza que deseja eliminar a ${name}? Todos os indicadores e auditorias associados serão removidos permanentemente da base de dados.`,
      onConfirm: async () => {
        try {
          await api.deleteOrganization(id);
          await refreshData();
        } catch (err) {
          console.error('Error deleting organization:', err);
        }
      }
    });
  };

  const handlePublishAnnouncement = async (title, content) => {
    try {
      await api.createAnnouncement({ title, content });
      await refreshData();
    } catch (err) {
      console.error('Error creating announcement:', err);
    }
  };

  const handleDeleteAnnouncement = (id, title) => {
    setConfirmData({
      isOpen: true,
      title: 'Eliminar Comunicado',
      message: `Tem a certeza que deseja eliminar o comunicado "${title}"? Esta ação não poderá ser desfeita.`,
      onConfirm: async () => {
        try {
          await api.deleteAnnouncement(id);
          await refreshData();
        } catch (err) {
          console.error('Error deleting announcement:', err);
        }
      }
    });
  };

  const handleIndicators = async (formData) => {
    try {
      await api.submitIndicators(formData);
      await refreshData();
    } catch (err) {
      console.error('Error submitting indicators:', err);
    }
  };

  const PAGE_TITLES = {
    dashboard: 'Visão Geral',
    acompanhamento: 'Acompanhamento',
    auditoria: 'Auditoria',
    censos: 'Censos Anuais',
    comunicacao: 'Comunicação',
  };

  const activePath = location.pathname.substring(1) || 'dashboard';
  const pageTitle  = PAGE_TITLES[activePath] || 'Visão Geral';

  return (
    <>
      {/* Camada de textura JE animada */}
      <JeBackground />

      <div className="relative z-10 flex h-screen overflow-hidden bg-transparent">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar muito fina e responsiva */}
          <header className="h-12 bg-white/70 backdrop-blur-md border-b border-gray-200/60 flex items-center px-6 lg:px-10 shrink-0 gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 -ml-1 text-gray-400 hover:text-gray-600 lg:hidden focus:outline-none rounded-lg hover:bg-gray-100"
              title="Abrir Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <p className="text-[12px] text-gray-400 font-medium tracking-wide">
              JE Portugal &nbsp;/&nbsp;
              <span className="text-gray-700 font-semibold">{pageTitle}</span>
            </p>
          </header>

          <main className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 lg:py-10">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-7 h-7 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route
                  path="/dashboard"
                  element={
                    <DashboardGeral
                      data={data}
                      getStatusBadge={getStatusBadge}
                      onCreateJE={handleCreateJE}
                      newJE={newJE}
                      setNewJE={setNewJE}
                      onUpdateJE={handleUpdateJE}
                      onDeleteJE={handleDeleteJE}
                    />
                  }
                />
                <Route
                  path="/acompanhamento"
                  element={<AcompanhamentoView data={data} onIndicatorSubmit={handleIndicators} />}
                />
                <Route
                  path="/auditoria"
                  element={<AuditoriaView data={data} onAuditChange={refreshData} />}
                />
                <Route path="/censos" element={<CensosView />} />
                <Route
                  path="/comunicacao"
                  element={
                    <ComunicacaoView
                      announcements={data.announcements}
                      onPublish={handlePublishAnnouncement}
                      onDelete={handleDeleteAnnouncement}
                    />
                  }
                />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            )}
          </main>
        </div>
      </div>

      {/* Pop-up de confirmação unificado e customizado */}
      <ConfirmModal
        isOpen={confirmData.isOpen}
        title={confirmData.title}
        message={confirmData.message}
        onConfirm={confirmData.onConfirm}
        onCancel={() => setConfirmData(p => ({ ...p, isOpen: false }))}
      />
    </>
  );
}
