import { useState } from 'react';
import { 
  ClipboardCheck, AlertCircle, FileText, CheckCircle2, 
  HelpCircle, UploadCloud, Info, Trash2 
} from 'lucide-react';

export default function AuditoriaView({ data }) {
  const [selectedAudit, setSelectedAudit] = useState(null);
  
  // Lista fictícia de requisitos de documentos de auditoria
  const [documents, setDocuments] = useState([
    { id: '1', name: 'Registo de Atividade Semestral', required: true, status: 'APPROVED', file: 'atividade.pdf' },
    { id: '2', name: 'Relatório de Contas Aprovado', required: true, status: 'DOCUMENTS_SUBMITTED', file: 'contas_2025.xlsx' },
    { id: '3', name: 'Documento de Conformidade RGPD', required: true, status: 'SCHEDULED', file: null },
    { id: '4', name: 'Ata da Assembleia Geral Eleitoral', required: false, status: 'REJECTED', file: 'ata_eleicao.pdf', feedback: 'Documento cortado na página 3.' }
  ]);

  const handleStatusChange = (id, action) => {
    setDocuments(prev => prev.map(doc => {
      if (doc.id === id) {
        return {
          ...doc,
          status: action === 'approve' ? 'APPROVED' : 'REJECTED',
          feedback: action === 'reject' ? 'Documentação incorreta ou incompleta.' : null
        };
      }
      return doc;
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'DOCUMENTS_SUBMITTED': return <Info className="w-5 h-5 text-amber-400 animate-pulse" />;
      case 'REJECTED': return <AlertCircle className="w-5 h-5 text-rose-400" />;
      default: return <ClockIcon />;
    }
  };

  const ClockIcon = () => (
    <span className="w-5 h-5 border-2 border-slate-700 border-t-slate-400 rounded-full animate-spin" />
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <ClipboardCheck className="w-6 h-6 text-indigo-400" />
          Módulo 2: Auditoria e Certificação
        </h2>
        <p className="text-sm text-slate-400">Coordene a auditoria das Júnior Empresas. Valide documentos, calcule pontuações e atribua a certificação.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de Documentos Exigidos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111827]/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-md font-bold text-white">Documentos de Qualidade</h3>
                <p className="text-xs text-slate-400">Verifique as submissões de documentos obrigatórios para auditoria.</p>
              </div>
              <button className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 transition-all flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4" />
                Submeter Novo
              </button>
            </div>

            <div className="space-y-3.5">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 bg-slate-900/35 border border-slate-800/80 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-800/80 border border-slate-700/60 rounded-lg mt-0.5">
                      <FileText className="w-4 h-4 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        {doc.name}
                        {doc.required && <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-bold uppercase">Obrigatório</span>}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {doc.file ? `Ficheiro: ${doc.file}` : 'Nenhum ficheiro anexado'}
                      </p>
                      {doc.feedback && (
                        <p className="text-xs text-rose-400 bg-rose-500/5 border border-rose-500/10 px-2.5 py-1 rounded-lg mt-2">
                          Feedback: {doc.feedback}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Ações de validação rápida */}
                  <div className="flex items-center gap-3.5 self-end md:self-center">
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(doc.status)}
                    </div>

                    {doc.status === 'DOCUMENTS_SUBMITTED' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleStatusChange(doc.id, 'approve')}
                          className="px-2.5 py-1 bg-emerald-600/15 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all"
                        >
                          Aprovar
                        </button>
                        <button 
                          onClick={() => handleStatusChange(doc.id, 'reject')}
                          className="px-2.5 py-1 bg-rose-600/15 border border-rose-500/30 text-rose-400 rounded-lg text-xs font-bold hover:bg-rose-600 hover:text-white transition-all"
                        >
                          Rejeitar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Informações da Auditoria e Score */}
        <div className="space-y-6">
          <div className="bg-[#111827]/40 border border-slate-800/80 p-6 rounded-2xl shadow-xl backdrop-blur-sm space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-1.5">
              <Info className="w-4 h-4 text-violet-400" />
              Critérios de Certificação
            </h3>
            <p className="text-xs text-slate-400">
              Para obter o selo de Júnior Empresa de qualidade da JE Portugal, a organização deve obter aprovação em todos os documentos obrigatórios e atingir um score superior a 70%.
            </p>

            <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/10 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Score Atual Estimado</span>
                <span className="font-bold text-indigo-400 text-lg">84.5%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full" style={{ width: '84.5%' }} />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>Mínimo: 70%</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Aprovada para Auditoria
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
