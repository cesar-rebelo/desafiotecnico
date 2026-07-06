import { useState } from 'react';
import { ClipboardCheck, CheckCircle2, AlertCircle, Clock, UploadCloud, FileText } from 'lucide-react';

const initialDocs = [
  { id: '1', name: 'Registo de Atividade Semestral',      required: true,  status: 'APPROVED',            file: 'atividade.pdf',    feedback: null },
  { id: '2', name: 'Relatório de Contas Aprovado',        required: true,  status: 'DOCUMENTS_SUBMITTED', file: 'contas_2025.xlsx', feedback: null },
  { id: '3', name: 'Conformidade RGPD',                   required: true,  status: 'SCHEDULED',           file: null,               feedback: null },
  { id: '4', name: 'Ata da Assembleia Geral Eleitoral',   required: false, status: 'REJECTED',            file: 'ata.pdf',          feedback: 'Documento incompleto na p.3.' },
];

const STATUS_CONFIG = {
  APPROVED:            { label: 'Aprovado',          icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 text-emerald-700' },
  DOCUMENTS_SUBMITTED: { label: 'Em Análise',        icon: Clock,        color: 'text-amber-400',   bg: 'bg-amber-50 text-amber-700' },
  SCHEDULED:           { label: 'Pendente',          icon: Clock,        color: 'text-gray-400',    bg: 'bg-gray-100 text-gray-500' },
  REJECTED:            { label: 'Rejeitado',         icon: AlertCircle,  color: 'text-red-500',     bg: 'bg-red-50 text-red-600' },
};

export default function AuditoriaView() {
  const [docs, setDocs] = useState(initialDocs);

  const act = (id, next) => setDocs(prev => prev.map(d =>
    d.id === id
      ? { ...d, status: next, feedback: next === 'REJECTED' ? 'Documentação incorreta ou incompleta.' : null }
      : d
  ));

  const approved  = docs.filter(d => d.status === 'APPROVED').length;
  const total     = docs.filter(d => d.required).length;
  const score     = Math.round((approved / initialDocs.length) * 100);

  return (
    <div className="space-y-7 animate-fadeUp">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Auditoria & Certificação</h1>
        <p className="text-sm text-gray-400 mt-0.5">Submissão e validação de documentos para certificação de qualidade da rede.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Documentos */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div>
              <h3 className="text-[14px] font-semibold text-gray-800">Documentos Exigidos</h3>
              <p className="text-[11px] text-gray-400">{approved} de {initialDocs.length} aprovados</p>
            </div>
            <button className="flex items-center gap-1.5 text-[12px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              <UploadCloud className="w-4 h-4" />
              Submeter
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {docs.map((doc) => {
              const cfg  = STATUS_CONFIG[doc.status] ?? STATUS_CONFIG.SCHEDULED;
              const Icon = cfg.icon;
              return (
                <div key={doc.id} className="px-6 py-4 hover:bg-gray-50/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-gray-50 border border-gray-100 rounded-lg mt-0.5">
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[13px] font-semibold text-gray-800">{doc.name}</p>
                        {doc.required && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">
                            Obrigatório
                          </span>
                        )}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.bg}`}>
                          {cfg.label}
                        </span>
                      </div>
                      {doc.file && (
                        <p className="text-[11px] text-gray-400 mt-0.5">{doc.file}</p>
                      )}
                      {doc.feedback && (
                        <p className="text-[11px] text-red-500 mt-1 bg-red-50 px-2 py-1 rounded-lg inline-block">
                          {doc.feedback}
                        </p>
                      )}
                    </div>
                    {doc.status === 'DOCUMENTS_SUBMITTED' && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => act(doc.id, 'APPROVED')}
                          className="text-[11px] font-semibold text-emerald-600 hover:underline"
                        >
                          Aprovar
                        </button>
                        <button
                          onClick={() => act(doc.id, 'REJECTED')}
                          className="text-[11px] font-semibold text-red-500 hover:underline"
                        >
                          Rejeitar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Score Card */}
        <div className="space-y-5">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
            <h3 className="text-[13px] font-semibold text-gray-800">Pontuação Estimada</h3>
            <div className="text-center py-4">
              <p className="text-4xl font-bold text-indigo-600">{score}%</p>
              <p className="text-[11px] text-gray-400 mt-1">
                {score >= 70 ? '✅ Aprovada para certificação' : '⚠️ Abaixo do mínimo (70%)'}
              </p>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${score >= 70 ? 'bg-indigo-500' : 'bg-amber-400'}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-lg font-bold text-gray-800">{approved}</p>
                <p className="text-[10px] text-gray-400">Aprovados</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-lg font-bold text-gray-800">{docs.filter(d => d.status === 'REJECTED').length}</p>
                <p className="text-[10px] text-gray-400">Rejeitados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
