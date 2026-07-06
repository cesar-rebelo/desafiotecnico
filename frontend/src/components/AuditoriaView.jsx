import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Clock, ChevronDown } from 'lucide-react';
import { api } from '../services/api';
import PromptModal from './PromptModal';

const STATUS = {
  APPROVED:            { label: 'Aprovado',   icon: CheckCircle2, cls: 'text-emerald-500', pill: 'bg-emerald-50 text-emerald-700' },
  DOCUMENTS_SUBMITTED: { label: 'Em Análise', icon: Clock,        cls: 'text-amber-400',  pill: 'bg-amber-50 text-amber-700' },
  SCHEDULED:           { label: 'Pendente',   icon: Clock,        cls: 'text-gray-300',   pill: 'bg-gray-100 text-gray-500' },
  REJECTED:            { label: 'Rejeitado',  icon: AlertCircle,  cls: 'text-red-500',    pill: 'bg-red-50 text-red-600' },
};

export default function AuditoriaView({ data, onAuditChange }) {
  const [selectedOrgId, setSelectedOrgId] = useState('');
  const [audit, setAudit]                 = useState(null);
  const [loading, setLoading]             = useState(false);

  // Estado para o Pop-up customizado de feedback/prompt
  const [promptData, setPromptData] = useState({
    isOpen: false,
    title: '',
    message: '',
    placeholder: '',
    defaultValue: '',
    onConfirm: () => {},
  });

  // Inicializar com a primeira organização se disponível
  useEffect(() => {
    if (data.organizationsStatus.length > 0 && !selectedOrgId) {
      setSelectedOrgId(data.organizationsStatus[0].id);
    }
  }, [data.organizationsStatus, selectedOrgId]);

  // Carregar os documentos de auditoria reais toda vez que mudar a organização
  const fetchAudit = async (orgId) => {
    if (!orgId) return;
    setLoading(true);
    try {
      const data = await api.getAudit(orgId);
      setAudit(data);
    } catch (err) {
      console.error('Erro ao buscar auditoria:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit(selectedOrgId);
  }, [selectedOrgId]);

  const handleApprove = async (docId) => {
    try {
      await api.updateAuditDocument(docId, true, null);
      await fetchAudit(selectedOrgId);
      if (onAuditChange) onAuditChange();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = (docId, docName) => {
    setPromptData({
      isOpen: true,
      title: 'Rejeitar Documento',
      message: `Indique o motivo da rejeição do documento "${docName}":`,
      placeholder: 'Escreva o feedback explicativo aqui...',
      defaultValue: '',
      onConfirm: async (feedback) => {
        if (!feedback.trim()) return;
        try {
          await api.updateAuditDocument(docId, false, feedback.trim());
          await fetchAudit(selectedOrgId);
          if (onAuditChange) onAuditChange();
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const handleSubmitDoc = async (docId) => {
    try {
      await api.submitAuditDocument(docId);
      await fetchAudit(selectedOrgId);
      if (onAuditChange) onAuditChange();
    } catch (err) {
      console.error(err);
    }
  };

  const docs     = audit?.documents || [];
  const approved = docs.filter(d => d.isApproved === true).length;
  const rejected = docs.filter(d => d.isApproved === false).length;
  const score    = audit?.score != null ? Math.round(audit.score) : 0;

  // Mapeamento de status boolean do Prisma para a config de status visual
  const getDocStatus = (doc) => {
    if (doc.isApproved === true) return 'APPROVED';
    if (doc.isApproved === false) return 'REJECTED';
    return doc.fileUrl ? 'DOCUMENTS_SUBMITTED' : 'SCHEDULED';
  };

  return (
    <div className="space-y-10 animate-fadeUp">
      {/* Header com Seletor */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Auditoria & Certificação</h1>
          <p className="text-sm text-gray-400 mt-1.5">Validação de documentos para certificação de qualidade da rede.</p>
        </div>
        
        {/* Seletor de Organização */}
        <div className="relative shrink-0">
          <select
            value={selectedOrgId}
            onChange={(e) => setSelectedOrgId(e.target.value)}
            className="appearance-none w-56 text-[13px] font-semibold text-gray-700 bg-white border border-gray-200/80 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 shadow-sm cursor-pointer transition-all"
          >
            {data.organizationsStatus.map(org => (
              <option key={org.id} value={org.id}>{org.name}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200/50 rounded-2xl p-10 flex items-center justify-center h-64 shadow-sm">
          <div className="w-7 h-7 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : !audit ? (
        <div className="bg-white border border-gray-200/50 rounded-2xl p-10 text-center text-gray-400 shadow-sm">
          Nenhuma auditoria registada para esta organização.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de documentos */}
          <div className="lg:col-span-2">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="text-[14px] font-semibold text-gray-700">{approved} de {docs.length} documentos aprovados</h2>
            </div>

            <div className="bg-white/75 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-sm">
              {docs.map((doc, i) => {
                const statusKey = getDocStatus(doc);
                const cfg       = STATUS[statusKey] ?? STATUS.SCHEDULED;
                const Icon      = cfg.icon;

                return (
                  <div key={doc.id}
                    className={`px-6 py-4.5 hover:bg-gray-50/40 transition-colors ${i < docs.length - 1 ? 'border-b border-gray-50' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.cls}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-[13px] font-semibold text-gray-800">{doc.name}</p>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.pill}`}>{cfg.label}</span>
                            <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-full">Obrigatório</span>
                          </div>
                          {doc.fileUrl && (
                            <a
                              href="#"
                              onClick={(e) => e.preventDefault()}
                              className="text-[11px] text-gray-400 hover:text-indigo-600 transition-colors mt-1 inline-block hover:underline"
                            >
                              Visualizar Documento Submetido
                            </a>
                          )}
                          {doc.feedback && (
                            <p className="text-[11px] text-red-500 mt-2 bg-red-50 px-2.5 py-1 rounded-lg inline-block border border-red-100/50 leading-relaxed">
                              <strong>Motivo da Rejeição:</strong> {doc.feedback}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Controlos de aprovação pelo Auditor / Ações do Utilizador */}
                      <div className="flex items-center gap-3.5 shrink-0 self-center">
                        {!doc.fileUrl || doc.isApproved === false ? (
                          <button
                            onClick={() => handleSubmitDoc(doc.id)}
                            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-[10px] font-bold rounded-lg transition-colors focus:outline-none"
                          >
                            Submeter Ficheiro
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleApprove(doc.id)}
                              disabled={doc.isApproved === true}
                              className={`text-[11px] font-semibold transition-all ${
                                doc.isApproved === true 
                                  ? 'text-gray-300 cursor-default' 
                                  : 'text-emerald-600 hover:text-emerald-700 hover:underline'
                              }`}
                            >
                              Aprovar
                            </button>
                            <button
                              onClick={() => handleReject(doc.id, doc.name)}
                              className="text-[11px] font-semibold text-red-500 hover:text-red-600 hover:underline"
                            >
                              Rejeitar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Score Geral */}
          <div>
            <h2 className="text-[14px] font-semibold text-gray-700 mb-5">Pontuação Estimada</h2>
            <div className="flex flex-col gap-4 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-sm">
              <p className="text-5xl font-bold text-gray-900">{score}<span className="text-2xl text-gray-400">%</span></p>
              <p className={`text-[12px] font-medium ${score >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {score >= 70 ? '✓ Aprovada para certificação' : '⚠ Abaixo do mínimo exigido (70%)'}
              </p>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${score >= 70 ? 'bg-indigo-500' : 'bg-amber-400'}`} style={{ width: `${score}%` }} />
              </div>
              <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold text-gray-800">{approved}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Aprovados</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">{rejected}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Rejeitados</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pop-up de feedback customizado */}
      <PromptModal
        isOpen={promptData.isOpen}
        title={promptData.title}
        message={promptData.message}
        placeholder={promptData.placeholder}
        defaultValue={promptData.defaultValue}
        onConfirm={promptData.onConfirm}
        onCancel={() => setPromptData(p => ({ ...p, isOpen: false }))}
      />
    </div>
  );
}
