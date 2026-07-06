import { useState } from 'react';

export default function FormularioCiclo({ selectedJE, onSubmit, onClose }) {
  const [faturamento, setFaturamento] = useState('');
  const [membros, setMembros] = useState('');
  const [nps, setNps] = useState('');
  const [semester, setSemester] = useState('2026.1');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      organizationId: selectedJE.id,
      faturamento,
      membros,
      nps,
      semester
    });
    setFaturamento('');
    setMembros('');
    setNps('');
  };

  return (
    <div className="p-6 bg-slate-900/60 border border-indigo-500/30 rounded-2xl shadow-xl space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-indigo-400">Preencher Ciclo Semestral: {selectedJE.name}</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1">Faturamento (€)</label>
          <input required type="number" value={faturamento} onChange={e => setFaturamento(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500" placeholder="1500" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Número de Membros</label>
          <input required type="number" value={membros} onChange={e => setMembros(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500" placeholder="30" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">NPS (Net Promoter Score)</label>
          <input required type="number" max="100" min="-100" value={nps} onChange={e => setNps(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500" placeholder="80" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1">Semestre de Referência</label>
          <select value={semester} onChange={e => setSemester(e.target.value)} className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-indigo-500">
            <option>2026.1</option>
            <option>2026.2</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all">
            Submeter Grelha de Indicadores
          </button>
        </div>
      </form>
    </div>
  );
}
