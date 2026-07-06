import { useState } from 'react';
import { FileText, ArrowRight, ArrowLeft, CheckCircle2, DollarSign, Users, Home } from 'lucide-react';

export default function CensosView() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jeName: '',
    foundationYear: '',
    membersCount: '',
    projectsCount: '',
    faturamentoAnual: '',
    headquarters: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => setStep(prev => Math.min(prev + 1, 3));
  const handlePrev = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      jeName: '',
      foundationYear: '',
      membersCount: '',
      projectsCount: '',
      faturamentoAnual: '',
      headquarters: '',
    });
    setStep(1);
    setSubmitted(false);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <FileText className="w-6 h-6 text-indigo-400" />
          Módulo 3: Censos Anuais
        </h2>
        <p className="text-sm text-slate-400">Recolha de dados anual de recursos, projetos e infraestruturas do MJP.</p>
      </div>

      <div className="max-w-2xl mx-auto bg-[#111827]/40 border border-slate-800/80 rounded-2xl p-8 shadow-xl backdrop-blur-sm">
        {submitted ? (
          <div className="text-center py-8 space-y-4 animate-scaleUp">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/5">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Censos Submetidos com Sucesso!</h3>
              <p className="text-sm text-slate-400">A federação agradece a sua colaboração no mapeamento da rede.</p>
            </div>
            <button 
              onClick={resetForm}
              className="px-4 py-2 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-700 transition-all"
            >
              Preencher Novamente
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step Progress Indicators */}
            <div className="flex justify-between items-center mb-8 relative">
              <div className="absolute h-0.5 bg-slate-800 left-8 right-8 top-1/2 -translate-y-1/2 -z-10" />
              <div 
                className="absolute h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 left-8 top-1/2 -translate-y-1/2 -z-10 transition-all duration-300"
                style={{ width: `${(step - 1) * 50}%` }}
              />

              {[
                { s: 1, icon: <Home className="w-4 h-4" />, label: 'Organização' },
                { s: 2, icon: <Users className="w-4 h-4" />, label: 'Membros' },
                { s: 3, icon: <DollarSign className="w-4 h-4" />, label: 'Financeiro' }
              ].map((item) => (
                <div key={item.s} className="flex flex-col items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                    step >= item.s 
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/10' 
                      : 'bg-slate-905 border-slate-800 text-slate-500'
                  }`}>
                    {item.icon}
                  </div>
                  <span className={`text-[10px] font-bold ${step >= item.s ? 'text-indigo-400' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Step Forms */}
            <div className="min-h-56">
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800/80 pb-2">Identificação Geral</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Nome da Júnior Empresa</label>
                      <input 
                        required 
                        type="text" 
                        value={formData.jeName}
                        onChange={e => setFormData(prev => ({ ...prev, jeName: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-violet-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all" 
                        placeholder="Ex: Porto Júnior" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Ano de Fundação</label>
                      <input 
                        required 
                        type="number" 
                        value={formData.foundationYear}
                        onChange={e => setFormData(prev => ({ ...prev, foundationYear: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-violet-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all" 
                        placeholder="Ex: 2012" 
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-400 mb-1">Localização/Sede</label>
                      <input 
                        required 
                        type="text" 
                        value={formData.headquarters}
                        onChange={e => setFormData(prev => ({ ...prev, headquarters: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-violet-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all" 
                        placeholder="Ex: Faculdade de Engenharia da Universidade do Porto" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800/80 pb-2">Recursos Humanos</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Número Total de Membros Ativos</label>
                      <input 
                        required 
                        type="number" 
                        value={formData.membersCount}
                        onChange={e => setFormData(prev => ({ ...prev, membersCount: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-violet-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all" 
                        placeholder="35" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Número de Projetos Realizados (Último Ano)</label>
                      <input 
                        required 
                        type="number" 
                        value={formData.projectsCount}
                        onChange={e => setFormData(prev => ({ ...prev, projectsCount: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-violet-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all" 
                        placeholder="12" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h4 className="text-sm font-bold text-slate-200 border-b border-slate-800/80 pb-2">Financeiro & Faturação</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Faturação Anual Bruta (€)</label>
                      <input 
                        required 
                        type="number" 
                        value={formData.faturamentoAnual}
                        onChange={e => setFormData(prev => ({ ...prev, faturamentoAnual: e.target.value }))}
                        className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-violet-500 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none transition-all" 
                        placeholder="18500" 
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center border-t border-slate-800/80 pt-6">
              <button 
                type="button" 
                onClick={handlePrev}
                disabled={step === 1}
                className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-400 rounded-xl text-xs font-semibold hover:text-slate-200 hover:bg-slate-800/40 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </button>

              {step === 3 ? (
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/10"
                >
                  Finalizar Censos
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={handleNext}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  Próximo
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
