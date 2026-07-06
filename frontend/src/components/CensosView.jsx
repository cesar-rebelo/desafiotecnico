import { useState } from 'react';
import { FileText, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

const STEPS = [
  { label: 'Organização', fields: ['jeName','foundationYear','headquarters'] },
  { label: 'Membros',     fields: ['membersCount','projectsCount'] },
  { label: 'Financeiro',  fields: ['faturamentoAnual'] },
];

export default function CensosView() {
  const [step, setStep]       = useState(0);
  const [done, setDone]       = useState(false);
  const [form, setForm]       = useState({
    jeName: '', foundationYear: '', headquarters: '',
    membersCount: '', projectsCount: '', faturamentoAnual: ''
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="space-y-7 animate-fadeUp">
      <div>
        <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">Censos Anuais</h1>
        <p className="text-sm text-gray-400 mt-0.5">Recolha estruturada de dados das Júnior Empresas da rede.</p>
      </div>

      <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
        {done ? (
          <div className="text-center py-6 space-y-3 animate-scaleUp">
            <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <h2 className="text-[16px] font-bold text-gray-900">Censo Submetido!</h2>
            <p className="text-[13px] text-gray-400">Obrigado pela colaboração no mapeamento da rede.</p>
            <button onClick={() => { setDone(false); setStep(0); }}
              className="text-[12px] text-indigo-600 hover:underline font-semibold">
              Preencher novamente
            </button>
          </div>
        ) : (
          <form onSubmit={e => { e.preventDefault(); if (step < STEPS.length - 1) setStep(s => s + 1); else setDone(true); }}>
            {/* Progress */}
            <div className="flex items-center gap-2 mb-8">
              {STEPS.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                    i < step ? 'bg-indigo-600 border-indigo-600 text-white' :
                    i === step ? 'bg-white border-indigo-600 text-indigo-600' :
                    'bg-white border-gray-200 text-gray-300'
                  }`}>{i + 1}</div>
                  <span className={`text-[12px] font-medium ${i === step ? 'text-gray-800' : 'text-gray-300'}`}>{s.label}</span>
                  {i < STEPS.length - 1 && <div className="w-6 h-px bg-gray-200 mx-1" />}
                </div>
              ))}
            </div>

            {/* Campos por passo */}
            <div className="space-y-4">
              {step === 0 && <>
                <Field label="Nome da Júnior Empresa"  value={form.jeName}          onChange={v => set('jeName', v)}          placeholder="Ex: Porto Júnior" />
                <Field label="Ano de Fundação"         value={form.foundationYear}   onChange={v => set('foundationYear', v)}   placeholder="Ex: 2014" type="number" />
                <Field label="Sede / Faculdade"        value={form.headquarters}     onChange={v => set('headquarters', v)}     placeholder="Ex: FEUP" />
              </>}
              {step === 1 && <>
                <Field label="Membros Ativos"          value={form.membersCount}     onChange={v => set('membersCount', v)}     placeholder="Ex: 35"  type="number" />
                <Field label="Projetos Realizados"     value={form.projectsCount}    onChange={v => set('projectsCount', v)}    placeholder="Ex: 12"  type="number" />
              </>}
              {step === 2 && <>
                <Field label="Faturação Anual Bruta (€)" value={form.faturamentoAnual} onChange={v => set('faturamentoAnual', v)} placeholder="Ex: 18500" type="number" />
              </>}
            </div>

            <div className="flex justify-between mt-8">
              <button type="button" onClick={() => setStep(s => s - 1)} disabled={step === 0}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:pointer-events-none">
                <ArrowLeft className="w-3.5 h-3.5" /> Anterior
              </button>
              <button type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-semibold rounded-xl transition-all">
                {step === STEPS.length - 1 ? 'Submeter Censo' : <>Próximo <ArrowRight className="w-3.5 h-3.5" /></>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="block text-[12px] font-semibold text-gray-600 mb-1">{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required
        className="w-full text-[13px] px-3.5 py-2.5 border border-gray-200 rounded-xl placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
      />
    </div>
  );
}
