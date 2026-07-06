import { useState } from 'react';
import { CheckCircle2, AlertCircle, Clock, UploadCloud, FileText } from 'lucide-react';

const initialDocs = [
  { id: '1', name: 'Registo de Atividade Semestral',    required: true,  status: 'APPROVED',            file: 'atividade.pdf',    feedback: null },
  { id: '2', name: 'Relatório de Contas Aprovado',      required: true,  status: 'DOCUMENTS_SUBMITTED', file: 'contas_2025.xlsx', feedback: null },
  { id: '3', name: 'Conformidade RGPD',                 required: true,  status: 'SCHEDULED',           file: null,               feedback: null },
  { id: '4', name: 'Ata da Assembleia Geral Eleitoral', required: false, status: 'REJECTED',            file: 'ata.pdf',          feedback: 'Documento incompleto na p.3.' },
];

const STATUS = {
  APPROVED:            { label: 'Aprovado',   icon: CheckCircle2, cls: 'text-emerald-500', pill: 'bg-emerald-50 text-emerald-700' },
  DOCUMENTS_SUBMITTED: { label: 'Em Análise', icon: Clock,        cls: 'text-amber-400',  pill: 'bg-amber-50 text-amber-700' },
  SCHEDULED:           { label: 'Pendente',   icon: Clock,        cls: 'text-gray-300',   pill: 'bg-gray-100 text-gray-500' },
  REJECTED:            { label: 'Rejeitado',  icon: AlertCircle,  cls: 'text-red-500',    pill: 'bg-red-50 text-red-600' },
};

export default function AuditoriaView() {
  const [docs, setDocs] = useState(initialDocs);

  const act = (id, next) => setDocs(p => p.map(d =>
    d.id === id ? { ...d, status: next, feedback: next === 'REJECTED' ? 'Documentação incorreta ou incompleta.' : null } : d
  ));

  const approved = docs.filter(d => d.status === 'APPROVED').length;
  const score    = Math.round((approved / docs.length) * 100);

  return (
    <div className="space-y-10 animate-fadeUp">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Auditoria & Certificação</h1>
        <p className="text-sm text-gray-400 mt-1.5">Validação de documentos para certificação de qualidade da rede.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de documentos */}
        <div className="lg:col-span-2">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-[14px] font-semibold text-gray-700">{approved} de {docs.length} documentos aprovados</h2>
            <button className="flex items-center gap-1.5 text-[12px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              <UploadCloud className="w-3.5 h-3.5" /> Submeter
            </button>
          </div>

          <div className="bg-white/75 backdrop-blur-sm border border-white/90 rounded-2xl overflow-hidden">
            {docs.map((doc, i) => {
              const cfg  = STATUS[doc.status] ?? STATUS.SCHEDULED;
              const Icon = cfg.icon;
              return (
                <div key={doc.id}
                  className={`px-6 py-4.5 hover:bg-gray-50/40 transition-colors ${i < docs.length - 1 ? 'border-b border-gray-50' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${cfg.cls}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[13px] font-semibold text-gray-800">{doc.name}</p>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.pill}`}>{cfg.label}</span>
                        {doc.required && <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded-full">Obrigatório</span>}
                      </div>
                      {doc.file    && <p className="text-[11px] text-gray-400 mt-0.5">{doc.file}</p>}
                      {doc.feedback && <p className="text-[11px] text-red-500 mt-1.5 bg-red-50 px-2.5 py-1 rounded-lg inline-block">{doc.feedback}</p>}
                    </div>
                    {doc.status === 'DOCUMENTS_SUBMITTED' && (
                      <div className="flex gap-3 shrink-0">
                        <button onClick={() => act(doc.id,'APPROVED')} className="text-[11px] font-semibold text-emerald-600 hover:underline">Aprovar</button>
                        <button onClick={() => act(doc.id,'REJECTED')} className="text-[11px] font-semibold text-red-500 hover:underline">Rejeitar</button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Score — sem caixa, editorial */}
        <div>
          <h2 className="text-[14px] font-semibold text-gray-700 mb-5">Pontuação Estimada</h2>
          <div className="flex flex-col gap-4">
            <p className="text-5xl font-bold text-gray-900">{score}<span className="text-2xl text-gray-400">%</span></p>
            <p className={`text-[12px] font-medium ${score >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {score >= 70 ? '✓ Aprovada para certificação' : '⚠ Abaixo do mínimo exigido (70%)'}
            </p>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${score >= 70 ? 'bg-indigo-500' : 'bg-amber-400'}`} style={{ width: `${score}%` }} />
            </div>
            <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-gray-800">{approved}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Aprovados</p>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{docs.filter(d => d.status === 'REJECTED').length}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Rejeitados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
